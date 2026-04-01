<template>
  <div class="sr-wizard__content">
    <!-- Mode switcher -->
    <div class="sr-content-mode-bar">
      <a-radio-group
        v-model:value="draft.content.viewMode"
        button-style="solid"
        size="small"
      >
        <a-radio-button value="outline">目录模式</a-radio-button>
        <a-radio-button value="content">正文模式</a-radio-button>
      </a-radio-group>

      <a-space v-if="draft.content.viewMode === 'outline'">
        <a-tag color="blue">{{ submittedCount }} / {{ totalCount }} 章节已确认</a-tag>
      </a-space>
    </div>

    <!-- ─── Outline mode ────────────────────────────────── -->
    <div v-if="draft.content.viewMode === 'outline'" class="sr-content-outline-mode">
      <a-card class="sr-page__card">
        <span class="sr-section-eyebrow">目录总览</span>
        <p class="sr-page__desc" style="margin-bottom: 16px">
          回看所有章节结构与当前编写状态。切换到「正文模式」以编辑各章节正文。
        </p>

        <div class="sr-content-chapter-list">
          <div
            v-for="item in draft.outline.items"
            :key="item.id"
            class="sr-content-chapter-row"
            :class="{
              'is-submitted': getChapterMeta(item.id).submitted,
              'has-content': !!item.contentHtml,
            }"
          >
            <div class="sr-content-chapter-row__info">
              <strong>{{ item.title }}</strong>
              <span v-if="getChapterMeta(item.id).submitted" class="sr-content-status sr-content-status--done">已确认</span>
              <span v-else-if="item.contentHtml" class="sr-content-status sr-content-status--draft">草稿</span>
              <span v-else class="sr-content-status sr-content-status--empty">未编写</span>
            </div>
            <a-button
              size="small"
              type="link"
              @click="goToChapter(item.id)"
            >
              编辑正文
            </a-button>
          </div>
        </div>
      </a-card>

      <div class="sr-page__stack">
        <a-card class="sr-page__card">
          <span class="sr-section-eyebrow">创建摘要</span>
          <a-descriptions :column="1" size="small">
            <a-descriptions-item label="标题">
              {{ draft.documentSettings.title || '未填写' }}
            </a-descriptions-item>
            <a-descriptions-item label="工程类型">
              {{ draft.parameterSelection.engineeringType }}
            </a-descriptions-item>
            <a-descriptions-item label="勘察阶段">
              {{ draft.parameterSelection.stage }}
            </a-descriptions-item>
            <a-descriptions-item label="生成方式">
              {{ modeLabel }}
            </a-descriptions-item>
            <a-descriptions-item label="章节数">
              {{ totalCount }}
            </a-descriptions-item>
            <a-descriptions-item label="已确认">
              {{ submittedCount }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </div>
    </div>

    <!-- ─── Content mode (three-column) ─────────────────── -->
    <div v-else class="sr-content-edit-mode">
      <!-- Left: chapter tree -->
      <div class="sr-content-edit__sidebar">
        <a-card class="sr-page__card sr-content-tree-card">
          <span class="sr-section-eyebrow">章节目录</span>
          <div class="sr-content-tree">
            <div
              v-for="item in draft.outline.items"
              :key="item.id"
              class="sr-content-tree__item"
              :class="{
                'is-active': item.id === draft.content.selectedChapterId,
                'is-submitted': getChapterMeta(item.id).submitted,
              }"
              @click="selectChapter(item.id)"
            >
              <span class="sr-content-tree__dot" />
              <span class="sr-content-tree__label">{{ item.title }}</span>
              <check-circle-outlined
                v-if="getChapterMeta(item.id).submitted"
                class="sr-content-tree__check"
              />
            </div>
          </div>
        </a-card>
      </div>

      <!-- Middle: editor work area -->
      <div class="sr-content-edit__main">
        <a-card v-if="selectedItem" class="sr-page__card sr-content-editor-card">
          <div class="sr-content-editor-head">
            <h3 class="sr-content-editor-head__title">{{ selectedItem.title }}</h3>
            <a-space>
              <a-button
                v-if="!draft.content.isGenerating && !selectedItem.contentHtml"
                type="primary"
                size="small"
                @click="startGenerate"
              >
                <template #icon><thunderbolt-outlined /></template>
                生成正文
              </a-button>
              <a-button
                v-if="draft.content.isGenerating"
                size="small"
                danger
                @click="abortGenerate"
              >
                停止生成
              </a-button>
              <a-button
                v-if="!draft.content.isGenerating && selectedItem.contentHtml"
                size="small"
                @click="regenerate"
              >
                <template #icon><redo-outlined /></template>
                重新生成
              </a-button>
            </a-space>
          </div>

          <!-- Streaming indicator -->
          <div v-if="draft.content.isGenerating" class="sr-content-streaming">
            <a-spin size="small" />
            <span>AI 正在生成内容…</span>
          </div>

          <!-- CKEditor -->
          <ckeditor
            :key="draft.content.selectedChapterId"
            :editor="ClassicEditor"
            :model-value="selectedItem.contentHtml"
            :config="editorConfig"
            :disabled="draft.content.isGenerating"
            @ready="onEditorReady"
            @update:model-value="onEditorUpdate"
          />

          <!-- Action bar below editor -->
          <div class="sr-content-editor-actions">
            <a-space>
              <a-button
                type="primary"
                size="small"
                :disabled="!selectedItem.contentHtml || draft.content.isGenerating"
                @click="submitChapter"
              >
                <template #icon><check-outlined /></template>
                提交修改
              </a-button>
              <a-button
                size="small"
                :disabled="!selectedItem.contentHtml || draft.content.isGenerating"
                @click="handleDownloadChapter"
              >
                <template #icon><download-outlined /></template>
                下载本章节
              </a-button>
            </a-space>

            <a-tag
              v-if="getChapterMeta(selectedItem.id).submitted"
              color="success"
            >
              已确认提交
            </a-tag>
          </div>
        </a-card>

        <a-card v-else class="sr-page__card">
          <a-empty description="请从左侧选择一个章节" />
        </a-card>
      </div>

      <!-- Right: status & download area -->
      <div class="sr-content-edit__aside">
        <a-card class="sr-page__card">
          <span class="sr-section-eyebrow">完成进度</span>
          <a-progress
            :percent="Math.round((submittedCount / Math.max(totalCount, 1)) * 100)"
            :stroke-color="{ from: '#2563eb', to: '#06b6d4' }"
            size="small"
            style="margin-bottom: 12px"
          />
          <p class="sr-page__desc">
            {{ submittedCount }} / {{ totalCount }} 章节已确认
          </p>
        </a-card>

        <a-card class="sr-page__card">
          <span class="sr-section-eyebrow">整案导出</span>
          <p class="sr-page__desc" style="margin-bottom: 12px">
            导出包含所有章节内容的完整勘察报告方案。
          </p>
          <a-button
            type="primary"
            block
            @click="handleDownloadFull"
            :disabled="submittedCount === 0"
          >
            <template #icon><download-outlined /></template>
            下载完整方案
          </a-button>
        </a-card>

        <a-card class="sr-page__card">
          <span class="sr-section-eyebrow">操作指南</span>
          <ul class="sr-content-guide-list">
            <li>点击左侧章节进入编辑</li>
            <li>首次可点击「生成正文」由 AI 自动撰写</li>
            <li>生成后可手动修改</li>
            <li>不满意可「重新生成」</li>
            <li>确认后点击「提交修改」</li>
          </ul>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onBeforeUnmount } from "vue";
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
import type { Editor } from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import {
  CheckCircleOutlined,
  ThunderboltOutlined,
  RedoOutlined,
  CheckOutlined,
  DownloadOutlined,
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { draft } from "@/lib/project-create-draft";
import type { ChapterMeta } from "@/lib/project-create-draft";
import { generateChapterContent } from "@/lib/mock-agent";
import type { StreamController } from "@/lib/mock-agent";
import { downloadChapterDocx, downloadFullDocx } from "@/lib/export-docx";

const editorConfig = {
  licenseKey: "GPL",
  plugins: [
    Essentials, Bold, Italic, Heading, Paragraph,
    List, BlockQuote, Table, TableToolbar, Indent, Undo,
  ],
  toolbar: [
    "undo", "redo", "|",
    "heading", "|",
    "bold", "italic", "|",
    "bulletedList", "numberedList", "|",
    "outdent", "indent", "|",
    "blockQuote", "insertTable",
  ],
  table: {
    contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
  },
};

const streamCtrl = ref<StreamController | null>(null);
const editorInstance = ref<Editor | null>(null);

function onEditorReady(editor: Editor) {
  editorInstance.value = editor;
}

const totalCount = computed(() => draft.outline.items.length);
const submittedCount = computed(
  () => draft.outline.items.filter((i) => getChapterMeta(i.id).submitted).length,
);

const selectedItem = computed(
  () => draft.outline.items.find((i) => i.id === draft.content.selectedChapterId),
);

const modeLabel = computed(() => {
  switch (draft.documentSettings.generationMode) {
    case "ai-full": return "AI 全自动生成";
    case "ai-assisted": return "AI 辅助编写";
    case "manual": return "手动编写";
    default: return "未选择";
  }
});

function getChapterMeta(id: string): ChapterMeta {
  if (!draft.content.chapterMeta[id]) {
    draft.content.chapterMeta[id] = {
      submitted: false,
      generatedAt: "",
      humanEdited: false,
    };
  }
  return draft.content.chapterMeta[id];
}

function selectChapter(id: string) {
  if (draft.content.isGenerating) {
    message.warning("请先等待当前生成完成或点击停止");
    return;
  }
  draft.content.selectedChapterId = id;
}

function goToChapter(id: string) {
  draft.content.selectedChapterId = id;
  draft.content.viewMode = "content";
}

function onEditorUpdate(...args: unknown[]) {
  const html = args[0];
  if (typeof html === "string") {
    const item = selectedItem.value;
    if (item) {
      item.contentHtml = html;
      const meta = getChapterMeta(item.id);
      meta.humanEdited = true;
    }
  }
}

function startGenerate() {
  const item = selectedItem.value;
  if (!item) return;

  draft.content.isGenerating = true;
  item.contentHtml = "";

  const editor = editorInstance.value;
  if (editor) {
    editor.setData("");
  }

  const ctrl = generateChapterContent(
    item,
    (accumulated) => {
      item.contentHtml = accumulated;
      if (editor) {
        editor.setData(accumulated);
      }
    },
    () => {
      draft.content.isGenerating = false;
      streamCtrl.value = null;
      const meta = getChapterMeta(item.id);
      meta.generatedAt = new Date().toISOString();
      meta.humanEdited = false;
    },
  );

  streamCtrl.value = ctrl;
}

function abortGenerate() {
  streamCtrl.value?.abort();
  draft.content.isGenerating = false;
  streamCtrl.value = null;
}

function regenerate() {
  const item = selectedItem.value;
  if (!item) return;

  const meta = getChapterMeta(item.id);
  meta.submitted = false;
  startGenerate();
}

function submitChapter() {
  const item = selectedItem.value;
  if (!item) return;

  const meta = getChapterMeta(item.id);
  meta.submitted = true;
  message.success(`「${item.title}」已确认提交`);
}

async function handleDownloadChapter() {
  const item = selectedItem.value;
  if (!item) return;
  try {
    await downloadChapterDocx(item, draft.documentSettings.title);
    message.success("章节下载成功");
  } catch {
    message.error("下载失败，请重试");
  }
}

async function handleDownloadFull() {
  try {
    await downloadFullDocx(draft.outline.items, draft.documentSettings.title);
    message.success("完整方案下载成功");
  } catch {
    message.error("下载失败，请重试");
  }
}

onBeforeUnmount(() => {
  streamCtrl.value?.abort();
});
</script>
