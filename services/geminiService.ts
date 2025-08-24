import { GoogleGenAI, Type } from "@google/genai";
import { DestinationInfo, ItineraryPlan } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. This will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "YOUR_API_KEY_HERE" });

const itinerarySchema = {
  type: Type.OBJECT,
  properties: {
    tripTitle: {
      type: Type.STRING,
      description: "여행 전체를 아우르는 창의적이고 매력적인 제목입니다. (예: '느리게 걷는 제주의 시간들')"
    },
    tripSlogan: {
      type: Type.STRING,
      description: "여행의 핵심 컨셉을 담은 한 문장의 슬로건입니다. (예: '오직 당신의 취향으로 채운 하루')"
    },
    destination: {
      type: Type.STRING,
      description: "사용자가 입력한 여행지입니다."
    },
    dailyPlans: {
      type: Type.ARRAY,
      description: "일자별 상세 여행 계획입니다.",
      items: {
        type: Type.OBJECT,
        properties: {
          day: { 
            type: Type.INTEGER,
            description: "여행 일차 (예: 1, 2, 3)."
          },
          theme: { 
            type: Type.STRING,
            description: "해당 날짜의 활동을 요약하는 감성적인 테마입니다 (예: '바다를 품은 카페와 노을 산책')."
          },
          activities: {
            type: Type.ARRAY,
            description: "해당 날짜에 할 활동 목록입니다.",
            items: {
              type: Type.OBJECT,
              properties: {
                time: {
                  type: Type.STRING,
                  description: "활동 시작 시간 (예: '09:00', '13:00', '19:00')."
                },
                activity: {
                  type: Type.STRING,
                  description: "활동의 이름입니다. 반드시 제공된 데이터의 'name'을 참조해야 합니다."
                },
                description: {
                  type: Type.STRING,
                  description: "활동에 대한 감성적이고 구체적인 설명입니다."
                },
                location: {
                  type: Type.STRING,
                  description: "활동 장소입니다. 반드시 제공된 데이터의 'location'을 참조해야 합니다."
                }
              },
              required: ["time", "activity", "description", "location"]
            }
          }
        },
        required: ["day", "theme", "activities"]
      }
    }
  },
  required: ["tripTitle", "tripSlogan", "destination", "dailyPlans"]
};

export const generateItinerary = async (
  destination: string,
  dates: string,
  interests: string,
  destinationData: DestinationInfo[]
): Promise<ItineraryPlan | null> => {
  try {
    const dataString = JSON.stringify(destinationData, null, 2);
    const prompt = `
      당신은 Tastetrip의 수석 여행 큐레이터이자, 해당 지역에서 오래 살아온 현지 전문가입니다. 당신의 임무는 사용자의 요청에 맞춰 단순한 정보 나열이 아닌, 하나의 완성된 '경험'을 선물하는 것입니다. 감성적이면서도 실용적인 여행 계획을 만들어주세요.

      **사용자 요청:**
      - 여행지: ${destination}
      - 여행 기간: ${dates}
      - 관심사 및 스타일: ${interests}

      **큐레이션 가이드라인:**
      1.  **현지인 관점:** "제가 이 동네 살아서 아는데..." 와 같은 말투로, 마치 친한 친구에게 알려주듯 친근하고 따뜻한 톤을 유지해주세요.
      2.  **데이터 기반:** 아래에 제공된 \`사용 가능한 여행지 정보\` JSON 목록에 있는 장소와 활동만을 사용해야 합니다. 목록에 없는 내용은 절대 추천하지 마세요.
      3.  **스토리텔링:** 각 활동을 시간 순서대로 논리적으로 연결하고, 하루의 흐름에 맞는 테마와 스토리를 부여해주세요. 왜 이 장소를 추천하는지에 대한 감성적인 이유를 덧붙여주세요.
      4.  **엄격한 형식 준수:** 결과는 반드시 지정된 JSON 스키마 형식과 정확히 일치해야 합니다. 어떠한 추가 설명이나 인사말도 JSON 외부에 포함하지 마세요.

      **사용 가능한 여행지 정보:**
      \`\`\`json
      ${dataString}
      \`\`\`
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: itinerarySchema,
        temperature: 0.8,
      },
    });

    const jsonText = response.text.trim();
    // A simple validation to ensure it's not an empty object
    if (jsonText.length < 2 || jsonText === '{}') {
        throw new Error("AI가 유효한 계획을 생성하지 못했습니다. 입력값을 조금 더 자세하게 작성해보세요.");
    }
    return JSON.parse(jsonText) as ItineraryPlan;
    
  } catch (error) {
    console.error("Error generating itinerary:", error);
    const anyError = error as any;
    let userMessage = "알 수 없는 오류로 코스 생성에 실패했습니다. 잠시 후 다시 시도해주세요.";

    const finishReason = anyError?.response?.candidates?.[0]?.finishReason;
    if (finishReason) {
        switch (finishReason) {
            case 'SAFETY':
                userMessage = "입력하신 내용에 부적절한 단어가 포함되어 있어 코스를 생성할 수 없습니다. 내용을 수정 후 다시 시도해주세요.";
                break;
            case 'RECITATION':
                userMessage = "입력하신 내용이 특정 자료와 유사하여 코스를 생성할 수 없습니다. 다른 표현으로 다시 시도해주세요.";
                break;
            case 'MAX_TOKENS':
                 userMessage = "요청 내용이 너무 길어 코스 생성에 실패했습니다. 조금 더 간결하게 작성해주세요.";
                 break;
            default:
                userMessage = `AI 모델이 응답을 완료하지 못했습니다 (이유: ${finishReason}). 잠시 후 다시 시도해주세요.`;
        }
    } else if (anyError.message && anyError.message.includes('API_KEY')) {
        userMessage = "서버 설정에 문제가 발생했습니다. 관리자에게 문의해주세요. (API 키 오류)";
    } else if (anyError.message) {
        userMessage = anyError.message;
    }
    
    throw new Error(userMessage);
  }
};