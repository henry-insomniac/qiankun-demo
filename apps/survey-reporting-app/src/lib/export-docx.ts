import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";
import { saveAs } from "file-saver";
import type { OutlineItem } from "./project-create-draft";

function stripHtml(html: string): string {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent ?? "";
}

function htmlToParagraphs(html: string): Paragraph[] {
  const div = document.createElement("div");
  div.innerHTML = html;

  const paragraphs: Paragraph[] = [];

  div.querySelectorAll("h1,h2,h3,h4,h5,h6,p,li,blockquote,td,th").forEach((el) => {
    const text = el.textContent?.trim();
    if (!text) return;

    const tag = el.tagName.toLowerCase();
    if (tag === "h1") {
      paragraphs.push(new Paragraph({ text, heading: HeadingLevel.HEADING_1 }));
    } else if (tag === "h2") {
      paragraphs.push(new Paragraph({ text, heading: HeadingLevel.HEADING_2 }));
    } else if (tag === "h3") {
      paragraphs.push(new Paragraph({ text, heading: HeadingLevel.HEADING_3 }));
    } else if (tag === "li") {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: `• ${text}` })],
          spacing: { after: 80 },
        }),
      );
    } else {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text })],
          spacing: { after: 120 },
        }),
      );
    }
  });

  if (paragraphs.length === 0 && stripHtml(html).trim()) {
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: stripHtml(html).trim() })],
      }),
    );
  }

  return paragraphs;
}

function buildChapterSection(item: OutlineItem): Paragraph[] {
  const parts: Paragraph[] = [
    new Paragraph({ text: item.title, heading: HeadingLevel.HEADING_1 }),
  ];

  if (item.contentHtml) {
    parts.push(...htmlToParagraphs(item.contentHtml));
  } else {
    parts.push(
      new Paragraph({
        children: [new TextRun({ text: "（本章节暂无内容）", italics: true })],
      }),
    );
  }

  return parts;
}

export async function downloadChapterDocx(
  item: OutlineItem,
  projectTitle: string,
) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: projectTitle || "勘察报告",
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: "" }),
          ...buildChapterSection(item),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${item.title}.docx`);
}

export async function downloadFullDocx(
  items: OutlineItem[],
  projectTitle: string,
) {
  const children: Paragraph[] = [
    new Paragraph({
      text: projectTitle || "勘察报告",
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({ text: "" }),
  ];

  for (const item of items) {
    children.push(...buildChapterSection(item));
    children.push(new Paragraph({ text: "" }));
  }

  const doc = new Document({
    sections: [{ properties: {}, children }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${projectTitle || "勘察报告"}-完整方案.docx`);
}
