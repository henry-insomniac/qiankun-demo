<template>
  <div class="sr-wizard__content">
    <div class="sr-outline-layout">
      <!-- 左栏：AI 目录编写思路 -->
      <div class="sr-outline-layout__aside">
        <a-card class="sr-page__card">
          <span class="sr-section-eyebrow">AI 编写思路</span>
          <p class="sr-page__desc" style="margin-bottom: 16px">
            基于工程类型和勘察阶段，AI 为每个章节提供编写指导。
            选中右侧某个目录后，此处将展示该章节的详细思路。
          </p>

          <div v-if="selectedItem" class="sr-outline-guidance">
            <h4 class="sr-outline-guidance__title">{{ selectedItem.title }}</h4>
            <a-alert
              show-icon
              type="info"
              :message="selectedItem.aiGuidance || '暂无 AI 思路'"
              style="margin-top: 12px"
            />
          </div>

          <a-divider style="margin: 16px 0" />

          <span class="sr-section-eyebrow">整体编写原则</span>
          <ul class="sr-outline-principles">
            <li>章节标题应当与国标模板保持一致</li>
            <li>正文表述应客观、准确，避免模糊用语</li>
            <li>数据引用需标注来源孔号或试验编号</li>
            <li>图表按"图 X-Y"格式统一编号</li>
            <li>结论部分须有定量参数支撑</li>
          </ul>
        </a-card>
      </div>

      <!-- 右栏：目录选择 + CKEditor 编辑区 -->
      <div class="sr-outline-layout__main">
        <a-card class="sr-page__card">
          <div class="sr-outline-header">
            <span class="sr-section-eyebrow">目录章节</span>
            <a-button size="small" type="dashed" @click="addChapter">添加章节</a-button>
          </div>

          <div class="sr-outline-tabs">
            <a-tag
              v-for="item in draft.outline.items"
              :key="item.id"
              :color="item.id === draft.outline.selectedItemId ? 'blue' : undefined"
              class="sr-outline-tabs__tag"
              @click="draft.outline.selectedItemId = item.id"
            >
              {{ item.title }}
            </a-tag>
          </div>
        </a-card>

        <a-card v-if="selectedItem" class="sr-page__card sr-outline-editor-card">
          <div class="sr-outline-editor-head">
            <a-input
              :value="selectedItem.title"
              @update:value="(val: string) => { if (selectedItem) selectedItem.title = val; }"
              size="large"
              placeholder="章节标题"
              class="sr-outline-editor-head__input"
            />
            <a-popconfirm
              title="确认删除该章节？"
              ok-text="确认"
              cancel-text="取消"
              @confirm="removeChapter(selectedItem.id)"
            >
              <a-button size="small" danger>删除</a-button>
            </a-popconfirm>
          </div>

          <ckeditor
            :editor="ClassicEditor"
            :model-value="selectedItem.contentHtml"
            @update:model-value="onEditorUpdate"
            :config="editorConfig"
          />
        </a-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Ckeditor } from "@ckeditor/ckeditor5-vue";
import {
  ClassicEditor,
  Essentials,
  Bold,
  Italic,
  Heading,
  Paragraph,
  List,
  BlockQuote,
  Table,
  TableToolbar,
  Indent,
  Undo,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

import { draft, createOutlineItem } from "@/lib/project-create-draft";

const editorConfig = {
  licenseKey: "GPL",
  plugins: [
    Essentials,
    Bold,
    Italic,
    Heading,
    Paragraph,
    List,
    BlockQuote,
    Table,
    TableToolbar,
    Indent,
    Undo,
  ],
  toolbar: [
    "undo",
    "redo",
    "|",
    "heading",
    "|",
    "bold",
    "italic",
    "|",
    "bulletedList",
    "numberedList",
    "|",
    "outdent",
    "indent",
    "|",
    "blockQuote",
    "insertTable",
  ],
  table: {
    contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
  },
};

const selectedItem = computed(() =>
  draft.outline.items.find((i) => i.id === draft.outline.selectedItemId),
);

function onEditorUpdate(...args: unknown[]) {
  const html = args[0];
  if (typeof html === "string") {
    const item = selectedItem.value;
    if (item) {
      item.contentHtml = html;
    }
  }
}

function addChapter() {
  const nextNum = draft.outline.items.length + 1;
  const item = createOutlineItem(`${nextNum}. 新章节`);
  draft.outline.items.push(item);
  draft.outline.selectedItemId = item.id;
}

function removeChapter(id: string) {
  const idx = draft.outline.items.findIndex((i) => i.id === id);
  if (idx < 0) return;
  draft.outline.items.splice(idx, 1);
  if (draft.outline.selectedItemId === id) {
    draft.outline.selectedItemId = draft.outline.items[0]?.id ?? "";
  }
}
</script>
