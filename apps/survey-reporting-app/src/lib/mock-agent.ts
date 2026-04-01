import type { OutlineItem } from "./project-create-draft";

const MOCK_PARAGRAPHS: Record<string, string[]> = {
  "1. 工程概况": [
    "<h2>1.1 项目基本信息</h2>",
    "<p>本工程位于XX市XX区，拟建建筑为综合交通枢纽，总用地面积约 42,000 m²。</p>",
    "<p>建设单位：XX市交通投资集团有限公司。勘察委托编号：GK-2026-0318。</p>",
    "<h2>1.2 拟建工程概况</h2>",
    "<p>拟建结构形式为框架-剪力墙结构，地上 6 层、地下 2 层，基础埋深约 12.0m，设计使用年限 50 年。</p>",
    "<p>建筑抗震设防类别为乙类，地基基础设计等级为甲级。</p>",
  ],
  "2. 勘察目的与任务": [
    "<h2>2.1 勘察目的</h2>",
    "<p>本次勘察为详细勘察阶段，目的是查明建设场地的工程地质条件和水文地质条件，为基础设计和施工提供可靠的地质依据。</p>",
    "<h2>2.2 主要任务</h2>",
    "<p>（1）查明场地各岩土层的分布、性质和变化规律；</p>",
    "<p>（2）查明地下水的类型、埋藏条件和腐蚀性；</p>",
    "<p>（3）评价场地稳定性和适宜性；</p>",
    "<p>（4）提供地基承载力和变形计算所需的岩土参数。</p>",
  ],
};

const GENERIC_PARAGRAPHS = [
  "<h2>概述</h2>",
  "<p>根据前期调查资料和规范要求，结合本工程实际情况，对本章节内容进行如下阐述。</p>",
  "<p>通过系统分析现场勘探数据和室内试验成果，得出以下主要结论。</p>",
  "<h2>详细分析</h2>",
  "<p>经综合判定，场地工程地质条件总体较好，适宜建设拟建工程。各项指标均满足设计要求，建议采用桩基础方案。</p>",
  "<p>施工过程中应注意地下水位变化对基坑稳定性的影响，建议设置降水措施。</p>",
];

function getParagraphs(title: string): string[] {
  for (const [key, paras] of Object.entries(MOCK_PARAGRAPHS)) {
    if (title.includes(key)) return paras;
  }
  return GENERIC_PARAGRAPHS;
}

export interface StreamController {
  abort: () => void;
}

export function generateChapterContent(
  item: OutlineItem,
  onChunk: (accumulatedHtml: string) => void,
  onDone: () => void,
): StreamController {
  const paragraphs = getParagraphs(item.title);
  let idx = 0;
  let accumulated = "";
  let aborted = false;

  const interval = setInterval(() => {
    if (aborted) {
      clearInterval(interval);
      return;
    }
    if (idx < paragraphs.length) {
      accumulated += paragraphs[idx];
      onChunk(accumulated);
      idx++;
    } else {
      clearInterval(interval);
      onDone();
    }
  }, 350);

  return {
    abort: () => {
      aborted = true;
      clearInterval(interval);
    },
  };
}
