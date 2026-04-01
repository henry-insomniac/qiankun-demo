<template>
  <div class="sr-wizard__content">
    <div class="sr-page__two-col">
      <div class="sr-page__stack">
        <a-card class="sr-page__card">
          <span class="sr-section-eyebrow">基本信息</span>
          <a-form layout="vertical" :model="draft.documentSettings">
            <a-form-item label="报告标题" required>
              <a-input
                v-model:value="draft.documentSettings.title"
                placeholder="例如：南站综合交通枢纽详勘报告"
                size="large"
              />
            </a-form-item>
          </a-form>
        </a-card>

        <a-card class="sr-page__card">
          <span class="sr-section-eyebrow">文档上传</span>
          <a-form layout="vertical">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="参考文档">
                  <a-upload-dragger :file-list="[]" :multiple="true">
                    <p class="ant-upload-drag-icon">
                      <inbox-outlined />
                    </p>
                    <p class="ant-upload-text">拖放或点击上传参考文档</p>
                    <p class="ant-upload-hint">支持 PDF、Word、Excel 格式</p>
                  </a-upload-dragger>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="参考规范">
                  <a-upload-dragger :file-list="[]" :multiple="true">
                    <p class="ant-upload-drag-icon">
                      <inbox-outlined />
                    </p>
                    <p class="ant-upload-text">拖放或点击上传参考规范</p>
                    <p class="ant-upload-hint">如 GB 50021、SL 188 等</p>
                  </a-upload-dragger>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="参数文件">
                  <a-upload-dragger :file-list="[]" :multiple="true">
                    <p class="ant-upload-drag-icon">
                      <inbox-outlined />
                    </p>
                    <p class="ant-upload-text">拖放或点击上传参数文件</p>
                    <p class="ant-upload-hint">试验数据、钻孔资料等</p>
                  </a-upload-dragger>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-card>
      </div>

      <div class="sr-page__stack">
        <a-card class="sr-page__card">
          <span class="sr-section-eyebrow">图片引用</span>
          <a-form layout="vertical">
            <a-form-item label="启用图片引用">
              <a-switch v-model:checked="draft.documentSettings.enableImageReference" />
              <p class="sr-page__desc" style="margin-top: 8px">
                开启后，正文中可引用上传的勘探剖面图、地层分布图等。
              </p>
            </a-form-item>
          </a-form>
        </a-card>

        <a-card class="sr-page__card">
          <span class="sr-section-eyebrow">生成方式</span>
          <a-form layout="vertical">
            <a-form-item label="选择生成策略">
              <a-radio-group v-model:value="draft.documentSettings.generationMode">
                <a-space direction="vertical" :size="12">
                  <a-radio value="ai-full">
                    <strong>AI 全自动生成</strong>
                    <p class="sr-page__desc">根据上传资料和模板一键生成完整报告</p>
                  </a-radio>
                  <a-radio value="ai-assisted">
                    <strong>AI 辅助编写</strong>
                    <p class="sr-page__desc">逐章节由 AI 生成初稿，人工逐步确认修订</p>
                  </a-radio>
                  <a-radio value="manual">
                    <strong>手动编写</strong>
                    <p class="sr-page__desc">仅使用模板结构，正文内容由人工填写</p>
                  </a-radio>
                </a-space>
              </a-radio-group>
            </a-form-item>
          </a-form>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { InboxOutlined } from "@ant-design/icons-vue";
import { draft } from "@/lib/project-create-draft";
</script>
