<template>
  <ProjectRouteShell
    v-if="project"
    :project="project"
    step="data"
    title="多源数据管理"
    description="把勘察纲要、地层、试验和周边成果组装成一份可生成、可追溯、可审核的数据底板。"
  >
    <a-card class="sr-page__card">
      <div class="sr-page__toolbar">
        <div>
          <span class="sr-section-eyebrow">数据装配工作台</span>
          <h3 class="sr-page__subtitle">当前阶段一眼看清</h3>
          <p class="sr-page__desc">
            先看整体完成度、阻塞项和下一步门槛，再进入具体模块处理，避免客户面对一堆无上下文的表单。
          </p>
        </div>
        <a-space wrap>
          <a-tag :color="nextStepReady ? 'success' : 'warning'">
            {{ nextStepReady ? "可进入模板选择" : "仍有门槛未通过" }}
          </a-tag>
          <a-button>保存草稿</a-button>
          <a-button
            type="primary"
            :disabled="!nextStepReady"
            @click="router.push(`/projects/${project.id}/template`)"
          >
            进入模板选择
          </a-button>
        </a-space>
      </div>

      <div class="sr-data-overview">
        <div class="sr-data-overview__metric">
          <span>整体完成度</span>
          <strong>{{ overallProgress }}%</strong>
          <a-progress
            :percent="overallProgress"
            :show-info="false"
            :status="blockingCount > 0 ? 'exception' : 'active'"
          />
        </div>
        <div class="sr-data-overview__metric">
          <span>已达标模块</span>
          <strong>{{ completedCount }}/{{ categories.length }}</strong>
          <small>达标标准：完成度不低于 80%</small>
        </div>
        <div class="sr-data-overview__metric">
          <span>待处理问题</span>
          <strong>{{ totalIssueCount }}</strong>
          <small>{{ blockingCount }} 项阻塞，{{ warningCount }} 项预警</small>
        </div>
        <div class="sr-data-overview__metric">
          <span>已入库数据源</span>
          <strong>{{ totalSourceCount }}</strong>
          <small>包含 Excel、原始编录和临近项目成果</small>
        </div>
      </div>

      <a-alert
        :type="blockingCount > 0 ? 'warning' : 'success'"
        show-icon
        :message="blockingCount > 0 ? `还有 ${blockingCount} 项阻塞没有处理` : '关键阻塞已清空'"
        :description="overviewMessage"
        class="sr-block-space"
      />
    </a-card>

    <div class="sr-data-layout">
      <a-card class="sr-page__card sr-data-layout__menu">
        <div class="sr-data-panel__head">
          <div>
            <h3 class="sr-page__subtitle">模块完成度</h3>
            <p class="sr-page__desc">每个模块都明确展示状态、来源和问题数。</p>
          </div>
          <a-tag color="processing">按模块推进</a-tag>
        </div>

        <a-space direction="vertical" class="sr-data-module-list" :size="12">
          <a-button
            v-for="item in categories"
            :key="item.key"
            block
            class="sr-data-module-button"
            :class="{ 'is-active': item.key === selectedCategoryKey }"
            :type="item.key === selectedCategoryKey ? 'primary' : 'default'"
            @click="selectedCategoryKey = item.key"
          >
            <span class="sr-data-module-button__body">
              <span class="sr-data-module-button__head">
                <strong>{{ item.title }}</strong>
                <a-tag :color="statusColor(item.status)">{{ item.status }}</a-tag>
              </span>
              <small>{{ item.description }}</small>
              <span class="sr-data-module-button__meta">
                {{ item.progress }}% 完成 · {{ item.sourceCount }} 个数据源 ·
                {{ item.issueCount }} 个问题
              </span>
              <a-progress
                :percent="item.progress"
                size="small"
                :show-info="false"
                :status="item.blockerCount > 0 ? 'exception' : 'active'"
              />
            </span>
          </a-button>
        </a-space>
      </a-card>

      <div class="sr-data-layout__content">
        <a-card class="sr-page__card">
          <div class="sr-page__toolbar">
            <div>
              <span class="sr-section-eyebrow">当前模块</span>
              <h3 class="sr-page__subtitle">{{ currentCategory.title }}</h3>
              <p class="sr-page__desc">{{ currentCategory.description }}</p>
            </div>
            <a-space wrap>
              <a-tag :color="statusColor(currentCategory.status)">
                {{ currentCategory.status }}
              </a-tag>
              <a-tag color="default">最后同步：{{ currentCategory.lastSync }}</a-tag>
            </a-space>
          </div>

          <div class="sr-data-module-kpis">
            <div class="sr-data-mini-stat">
              <span>模块完成度</span>
              <strong>{{ currentCategory.progress }}%</strong>
            </div>
            <div class="sr-data-mini-stat">
              <span>已接入来源</span>
              <strong>{{ currentCategory.sourceCount }}</strong>
            </div>
            <div class="sr-data-mini-stat">
              <span>阻塞 / 预警</span>
              <strong>{{ currentCategory.blockerCount }} / {{ currentCategory.issueCount }}</strong>
            </div>
            <div class="sr-data-mini-stat">
              <span>下一动作</span>
              <strong>{{ currentCategory.nextAction }}</strong>
            </div>
          </div>

          <div class="sr-data-panels">
            <section class="sr-data-panel">
              <div class="sr-data-panel__head">
                <div>
                  <h4>当前模块必须交付什么</h4>
                  <p>先把客户关心的结果讲清楚，而不是直接堆输入框。</p>
                </div>
                <FolderOpenOutlined />
              </div>
              <a-list :data-source="currentCategory.goals" size="small">
                <template #renderItem="{ item }">
                  <a-list-item class="sr-data-check-item">
                    <CheckCircleOutlined />
                    <span>{{ item }}</span>
                  </a-list-item>
                </template>
              </a-list>
            </section>

            <section class="sr-data-panel">
              <div class="sr-data-panel__head">
                <div>
                  <h4>当前需要处理的问题</h4>
                  <p>每条问题都保留等级和说明，避免用户不知道先处理什么。</p>
                </div>
                <WarningOutlined />
              </div>
              <a-list
                v-if="currentCategory.issues.length > 0"
                :data-source="currentCategory.issues"
                item-layout="horizontal"
              >
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta :description="item.description">
                      <template #title>
                        <a-space wrap>
                          <a-tag :color="issueColor(item.level)">{{ item.level }}</a-tag>
                          <span>{{ item.title }}</span>
                        </a-space>
                      </template>
                    </a-list-item-meta>
                  </a-list-item>
                </template>
              </a-list>
              <a-empty v-else description="当前模块没有待处理问题，可继续推进后续环节。" />
            </section>
          </div>

          <a-tabs v-model:activeKey="activeTab">
            <a-tab-pane key="manual" tab="手动整理">
              <a-form layout="vertical">
                <a-row :gutter="16">
                  <a-col :span="12">
                    <a-form-item label="本模块结论摘要">
                      <a-textarea
                        :rows="6"
                        :value="currentCategory.summary"
                        placeholder="输入当前模块的结构化勘察结论"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="可信度评估">
                      <a-slider :value="currentCategory.progress" :min="0" :max="100" />
                    </a-form-item>
                    <a-form-item label="处理备注">
                      <a-textarea
                        :rows="6"
                        :placeholder="currentCategory.notesPlaceholder"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </a-tab-pane>

            <a-tab-pane key="import" tab="导入与解析">
              <div class="sr-data-import-grid">
                <a-upload-dragger :before-upload="beforeUpload" multiple>
                  <p class="ant-upload-drag-icon">
                    <UploadOutlined />
                  </p>
                  <p class="ant-upload-text">拖入 Excel 或点击上传</p>
                  <p class="ant-upload-hint">{{ currentCategory.importHint }}</p>
                </a-upload-dragger>

                <section class="sr-data-panel">
                  <div class="sr-data-panel__head">
                    <div>
                      <h4>解析链路</h4>
                      <p>把上传、解析、映射和人工确认拆开显示，避免“上传完就结束”的错觉。</p>
                    </div>
                    <SyncOutlined />
                  </div>
                  <a-list :data-source="currentCategory.importStages" size="small">
                    <template #renderItem="{ item }">
                      <a-list-item>
                        <a-list-item-meta :description="item.description">
                          <template #title>
                            <a-space wrap>
                              <a-tag :color="stageColor(item.status)">{{ item.status }}</a-tag>
                              <span>{{ item.label }}</span>
                            </a-space>
                          </template>
                        </a-list-item-meta>
                      </a-list-item>
                    </template>
                  </a-list>
                </section>
              </div>
            </a-tab-pane>

            <a-tab-pane key="quality" tab="校验与说明">
              <div class="sr-data-quality-grid">
                <section class="sr-data-panel">
                  <div class="sr-data-panel__head">
                    <div>
                      <h4>风险提示</h4>
                      <p>这部分直接告诉用户哪些问题会拦截后续步骤，哪些只是降低可信度。</p>
                    </div>
                    <FileSearchOutlined />
                  </div>
                  <a-list :data-source="currentCategory.risks">
                    <template #renderItem="{ item }">
                      <a-list-item class="sr-data-risk-item">
                        <a-space align="start">
                          <a-tag :color="item.blocking ? 'error' : 'warning'">
                            {{ item.blocking ? "阻塞" : "预警" }}
                          </a-tag>
                          <span>{{ item.text }}</span>
                        </a-space>
                      </a-list-item>
                    </template>
                  </a-list>
                </section>

                <section class="sr-data-panel">
                  <div class="sr-data-panel__head">
                    <div>
                      <h4>交付说明</h4>
                      <p>给审核人和后续 AI 生成一个一致的上下文，不再让人猜测字段意义。</p>
                    </div>
                    <FlagOutlined />
                  </div>
                  <a-alert
                    show-icon
                    type="info"
                    :message="currentCategory.handoverTitle"
                    :description="currentCategory.handoverDescription"
                  />
                </section>
              </div>
            </a-tab-pane>
          </a-tabs>
        </a-card>

        <a-card class="sr-page__card">
          <div class="sr-page__toolbar">
            <div>
              <h3 class="sr-page__subtitle">解析预览与来源映射</h3>
              <p class="sr-page__desc">先看解析结果是否可信，再决定是否合并进当前草稿。</p>
            </div>
            <a-space wrap>
              <a-tag color="processing">来源 {{ currentCategory.sourceCount }} 个</a-tag>
              <a-tag :color="currentCategory.blockerCount > 0 ? 'warning' : 'success'">
                {{ currentCategory.blockerCount > 0 ? "需人工确认" : "可直接合并" }}
              </a-tag>
            </a-space>
          </div>
          <a-table
            :columns="previewColumns"
            :data-source="currentCategory.previewRows"
            row-key="key"
            :pagination="false"
          />
        </a-card>
      </div>
    </div>

    <template #aside>
      <a-card class="sr-page__card">
        <div class="sr-data-gate">
          <div class="sr-data-panel__head">
            <div>
              <h3 class="sr-page__subtitle">进入下一步前的门槛</h3>
              <p class="sr-page__desc">这一块直接告诉客户为什么现在能不能进模板选择。</p>
            </div>
            <a-tag :color="nextStepReady ? 'success' : 'warning'">
              {{ gatePassedCount }}/{{ gateChecks.length }} 通过
            </a-tag>
          </div>
          <a-progress
            :percent="gateProgress"
            :show-info="false"
            :status="nextStepReady ? 'success' : 'exception'"
          />
          <a-list :data-source="gateChecks" class="sr-block-space">
            <template #renderItem="{ item }">
              <a-list-item>
                <a-list-item-meta :description="item.detail">
                  <template #title>
                    <a-space wrap>
                      <a-tag :color="item.passed ? 'success' : 'warning'">
                        {{ item.passed ? "已通过" : "待处理" }}
                      </a-tag>
                      <span>{{ item.label }}</span>
                    </a-space>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </div>
      </a-card>

      <a-card class="sr-page__card">
        <Attachments
          :items="attachmentItems"
          :placeholder="attachmentPlaceholder"
          overflow="wrap"
        />
      </a-card>

      <a-card class="sr-page__card">
        <QuickActionPanel
          title="数据快捷操作"
          description="把校验、对比、快照和发起生成前的动作收成一组直接可点的操作。"
          :items="actionItems"
        />
      </a-card>
    </template>
  </ProjectRouteShell>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { message } from "ant-design-vue";
import {
  CameraOutlined,
  CheckCircleOutlined,
  DeploymentUnitOutlined,
  FileSearchOutlined,
  FlagOutlined,
  FolderOpenOutlined,
  SyncOutlined,
  UploadOutlined,
  WarningOutlined,
} from "@ant-design/icons-vue";
import { Attachments } from "ant-design-x-vue";
import { useRoute, useRouter } from "vue-router";

import ProjectRouteShell from "@/components/ProjectRouteShell.vue";
import QuickActionPanel, { type QuickActionItem } from "@/components/QuickActionPanel.vue";
import { findProjectById } from "@/mock/data";

type CategoryStatus = "未开始" | "进行中" | "待确认" | "已完成";
type IssueLevel = "阻塞" | "警告" | "提示";
type StageStatus = "已完成" | "处理中" | "待确认";

interface CategoryIssue {
  level: IssueLevel;
  title: string;
  description: string;
}

interface ImportStage {
  label: string;
  description: string;
  status: StageStatus;
}

interface RiskItem {
  text: string;
  blocking: boolean;
}

interface PreviewRow {
  key: string;
  hole: string;
  layer: string;
  depth: string;
  status: string;
}

interface DataCategory {
  key: string;
  title: string;
  description: string;
  status: CategoryStatus;
  progress: number;
  sourceCount: number;
  issueCount: number;
  blockerCount: number;
  lastSync: string;
  summary: string;
  notesPlaceholder: string;
  nextAction: string;
  importHint: string;
  handoverTitle: string;
  handoverDescription: string;
  goals: string[];
  issues: CategoryIssue[];
  importStages: ImportStage[];
  risks: RiskItem[];
  previewRows: PreviewRow[];
}

interface GateCheck {
  key: string;
  label: string;
  detail: string;
  passed: boolean;
}

const route = useRoute();
const router = useRouter();
const project = computed(() => findProjectById(route.params.id as string | undefined));

const selectedCategoryKey = ref("strata");
const activeTab = ref("manual");

const categories: DataCategory[] = [
  {
    key: "outline",
    title: "勘察纲要",
    description: "确认勘察目标、布孔策略和风险边界，保证后面所有数据都有上下文。",
    status: "已完成",
    progress: 100,
    sourceCount: 2,
    issueCount: 0,
    blockerCount: 0,
    lastSync: "10:18",
    summary: "勘察目标、布孔策略和场地风险边界已确认，可作为后续数据整理与 AI 生成的总约束。",
    notesPlaceholder: "记录纲要与现场变化的偏差说明。",
    nextAction: "进入地层分组",
    importHint: "支持上传纲要附件、布孔表和任务书，不会直接覆盖当前结论。",
    handoverTitle: "本模块已满足后续使用条件",
    handoverDescription: "AI 生成阶段将把纲要作为章节边界和风险叙述的总约束，不再单独请求补充。",
    goals: [
      "明确本次勘察范围、工程对象和布孔逻辑。",
      "锁定必须覆盖的风险专题和结论边界。",
      "为后续地层与试验数据提供统一解释口径。",
    ],
    issues: [],
    importStages: [
      { label: "上传任务书与纲要", description: "2 份附件已入库。", status: "已完成" },
      { label: "提取关键目标和风险项", description: "已映射到项目约束模型。", status: "已完成" },
      { label: "人工确认结果", description: "当前版本已确认。", status: "已完成" },
    ],
    risks: [
      { text: "当前模块无阻塞项，可直接作为后续数据解释依据。", blocking: false },
    ],
    previewRows: [
      { key: "1", hole: "目标", layer: "站房主体 + 地下空间", depth: "全场区", status: "已确认" },
      { key: "2", hole: "约束", layer: "高地下水位 / 横向分层变化", depth: "重点关注", status: "已确认" },
    ],
  },
  {
    key: "strata",
    title: "地层数据",
    description: "按钻孔、分层和深度区间把地层资料整理成可生成的标准结构。",
    status: "进行中",
    progress: 78,
    sourceCount: 3,
    issueCount: 2,
    blockerCount: 1,
    lastSync: "11:06",
    summary: "主体钻孔分层已完成归并，但 ZK-02 与 ZK-05 仍存在深度倒挂，需要人工确认分层界线。",
    notesPlaceholder: "例如：ZK-02 2.1m~3.0m 分层描述与原始编录冲突。",
    nextAction: "处理深度倒挂",
    importHint: "上传地层编录表后会先解析，再进入分层映射和异常检查。",
    handoverTitle: "地层模块仍有 1 项阻塞",
    handoverDescription: "阻塞项解决前，AI 会生成不稳定的地层横向对比结论，因此当前不建议直接进入模板选择。",
    goals: [
      "统一钻孔分层名称和深度区间，避免同一层位多种写法。",
      "把异常孔位标注出来，供后续章节引用。",
      "确保地层分组可直接用于剖面和建议章节。",
    ],
    issues: [
      {
        level: "阻塞",
        title: "ZK-02 深度倒挂未确认",
        description: "2.1m - 3.0m 记录出现粉质黏土与卵石层顺序冲突。",
      },
      {
        level: "警告",
        title: "ZK-05 层名与原始编录不一致",
        description: "自动归并为中风化泥岩，但原始表记录为强风化泥岩。",
      },
    ],
    importStages: [
      { label: "上传地层编录表", description: "已接收 1 份 Excel。", status: "已完成" },
      { label: "自动识别分层结构", description: "已识别 18 个层位片段。", status: "已完成" },
      { label: "异常孔位人工确认", description: "仍有 2 个孔位待确认。", status: "待确认" },
    ],
    risks: [
      { text: "深度倒挂会影响地层横向对比和承载层推荐。", blocking: true },
      { text: "层名不统一会导致正文与附表口径不一致。", blocking: false },
    ],
    previewRows: [
      { key: "1", hole: "ZK-01", layer: "杂填土 → 粉质黏土", depth: "0.0m - 6.4m", status: "正常" },
      { key: "2", hole: "ZK-02", layer: "粉质黏土 → 卵石层", depth: "2.1m - 13.5m", status: "深度倒挂" },
      { key: "3", hole: "ZK-07", layer: "卵石层 → 中风化泥岩", depth: "8.2m - 19.0m", status: "正常" },
    ],
  },
  {
    key: "tests",
    title: "原位 / 土工试验",
    description: "整理标贯、动力触探和室内试验结果，形成可引用的参数组。",
    status: "待确认",
    progress: 64,
    sourceCount: 2,
    issueCount: 1,
    blockerCount: 0,
    lastSync: "09:42",
    summary: "试验数据已完成导入和分组，当前需要确认一组异常值是否剔除。",
    notesPlaceholder: "例如：N63.5 动探结果是否作为离群值剔除。",
    nextAction: "确认异常值处理",
    importHint: "支持批量导入原位试验与室内试验汇总表，系统会自动做异常值检测。",
    handoverTitle: "试验参数可用于生成，但建议先确认异常值策略",
    handoverDescription: "如果直接进入生成，AI 会按当前统计结果引用，可能与总工最终判断不一致。",
    goals: [
      "完成试验参数的分层统计和代表值选择。",
      "标注异常值，明确剔除或保留依据。",
      "让参数表和建议章节共用同一批数据源。",
    ],
    issues: [
      {
        level: "警告",
        title: "中砂层 N63.5 出现离群高值",
        description: "建议人工确认是否受局部卵石夹层影响。",
      },
    ],
    importStages: [
      { label: "上传试验汇总表", description: "已接收 2 份 Excel。", status: "已完成" },
      { label: "自动统计代表值", description: "已生成 6 组参数统计。", status: "已完成" },
      { label: "异常值确认", description: "等待专业人员确认剔除策略。", status: "待确认" },
    ],
    risks: [
      { text: "异常值策略未确认会影响代表值可信度，但不阻塞流程。", blocking: false },
    ],
    previewRows: [
      { key: "1", hole: "中砂层", layer: "标贯 N 值代表值", depth: "6.0m - 9.0m", status: "待确认" },
      { key: "2", hole: "卵石层", layer: "动力触探修正击数", depth: "9.0m - 14.0m", status: "正常" },
    ],
  },
  {
    key: "geology",
    title: "地理与地质信息",
    description: "汇总地貌、构造、水文和不良地质作用，为风险章节提供判断依据。",
    status: "进行中",
    progress: 82,
    sourceCount: 2,
    issueCount: 1,
    blockerCount: 0,
    lastSync: "10:51",
    summary: "地貌与构造信息已完成整理，地下水季节性修正说明仍待补充。",
    notesPlaceholder: "补充雨季不利工况和周边排水工程影响。",
    nextAction: "补齐地下水修正说明",
    importHint: "支持补充地质图、地貌判读成果和地下水观测记录。",
    handoverTitle: "可继续下游流程，但建议先补齐雨季工况说明",
    handoverDescription: "这部分不阻塞模板选择，但会影响地下水评价章节的完整度。",
    goals: [
      "明确地貌、构造和水文条件对场地稳定性的影响。",
      "统一地下水评价口径，避免正文和结论冲突。",
      "把不良地质作用判断写成可审核的证据链。",
    ],
    issues: [
      {
        level: "提示",
        title: "地下水评价缺少雨季不利工况",
        description: "建议补充一次极端天气下的排水与渗流判断。",
      },
    ],
    importStages: [
      { label: "上传水文地质资料", description: "已同步地貌和构造说明。", status: "已完成" },
      { label: "自动提取风险点", description: "已识别 3 项场地风险。", status: "处理中" },
      { label: "补充季节性说明", description: "等待人工补充。", status: "待确认" },
    ],
    risks: [
      { text: "地下水评价缺少季节修正，会降低章节完整性。", blocking: false },
    ],
    previewRows: [
      { key: "1", hole: "场地地貌", layer: "冲洪积平原", depth: "场区", status: "正常" },
      { key: "2", hole: "地下水", layer: "第四系孔隙潜水", depth: "2.4m - 5.1m", status: "需补充说明" },
    ],
  },
  {
    key: "nearby",
    title: "临近项目成果",
    description: "作为补充证据参考，必须保留引用来源和人工确认记录。",
    status: "未开始",
    progress: 35,
    sourceCount: 1,
    issueCount: 1,
    blockerCount: 1,
    lastSync: "未同步",
    summary: "临近项目资料已上传，但尚未建立与本项目的引用边界和差异说明。",
    notesPlaceholder: "说明哪些结论可引用，哪些只能作为旁证。",
    nextAction: "建立引用边界",
    importHint: "导入临近项目成果后，系统只做对比，不会直接覆盖本项目数据。",
    handoverTitle: "当前模块不能直接纳入生成",
    handoverDescription: "未建立引用边界前，临近项目成果只能作为旁证，不能合并到主数据底板。",
    goals: [
      "明确临近项目成果只作为旁证，不得直接覆盖本项目结论。",
      "建立差异说明，避免横向引用失真。",
      "保留审计记录，便于审核追溯。",
    ],
    issues: [
      {
        level: "阻塞",
        title: "引用边界未定义",
        description: "当前资料缺少与本项目钻孔范围、工况差异的说明。",
      },
    ],
    importStages: [
      { label: "上传临近项目资料", description: "1 份成果已上传。", status: "已完成" },
      { label: "建立差异清单", description: "尚未开始人工标注。", status: "待确认" },
      { label: "形成可引用结论", description: "未满足条件。", status: "待确认" },
    ],
    risks: [
      { text: "未定义引用边界时，不能把临近项目成果并入主数据底板。", blocking: true },
    ],
    previewRows: [
      { key: "1", hole: "旁站项目 A", layer: "卵石层较厚", depth: "6.0m - 18.0m", status: "仅供参考" },
    ],
  },
];

const currentCategory = computed(
  () => categories.find((item) => item.key === selectedCategoryKey.value) ?? categories[0],
);

const completedCount = computed(
  () => categories.filter((item) => item.progress >= 80).length,
);

const totalIssueCount = computed(
  () => categories.reduce((sum, item) => sum + item.issueCount, 0),
);

const blockingCount = computed(
  () => categories.reduce((sum, item) => sum + item.blockerCount, 0),
);

const warningCount = computed(() => totalIssueCount.value - blockingCount.value);

const totalSourceCount = computed(
  () => categories.reduce((sum, item) => sum + item.sourceCount, 0),
);

const overallProgress = computed(() =>
  Math.round(
    categories.reduce((sum, item) => sum + item.progress, 0) / categories.length,
  ),
);

const gateChecks = computed<GateCheck[]>(() => [
  {
    key: "coverage",
    label: "至少 4 个模块完成度达到 80%",
    detail: `当前 ${completedCount.value} / ${categories.length} 个模块达标。`,
    passed: completedCount.value >= 4,
  },
  {
    key: "blocking",
    label: "关键阻塞项已清零",
    detail: `当前仍有 ${blockingCount.value} 项阻塞需要人工确认。`,
    passed: blockingCount.value === 0,
  },
  {
    key: "trace",
    label: "所有导入资料都有来源和说明",
    detail: "临近项目成果仍未建立引用边界，追溯链条不完整。",
    passed: categories.every((item) => item.key !== "nearby" || item.progress >= 80),
  },
]);

const gatePassedCount = computed(
  () => gateChecks.value.filter((item) => item.passed).length,
);

const gateProgress = computed(() =>
  Math.round((gatePassedCount.value / gateChecks.value.length) * 100),
);

const nextStepReady = computed(() => gateChecks.value.every((item) => item.passed));

const overviewMessage = computed(() =>
  nextStepReady.value
    ? "所有关键门槛已通过，可以进入模板选择。"
    : "当前最需要先处理的是地层数据里的深度倒挂，以及临近项目成果的引用边界。",
);

const previewColumns = [
  { title: "孔号 / 分组", dataIndex: "hole", key: "hole" },
  { title: "层位描述", dataIndex: "layer", key: "layer" },
  { title: "深度区间", dataIndex: "depth", key: "depth" },
  { title: "识别结果", dataIndex: "status", key: "status" },
];

const attachmentItems = computed(() => [
  {
    uid: `${currentCategory.value.key}-attachment-1`,
    name: `${currentCategory.value.title}主数据.xlsx`,
    status: "done",
    description: `最近同步时间 ${currentCategory.value.lastSync}。`,
  },
  {
    uid: `${currentCategory.value.key}-attachment-2`,
    name: `${currentCategory.value.title}差异说明.xlsx`,
    status: currentCategory.value.blockerCount > 0 ? "error" : "done",
    description:
      currentCategory.value.blockerCount > 0
        ? `仍有 ${currentCategory.value.blockerCount} 项阻塞待人工确认。`
        : "本模块当前没有阻塞项。",
  },
]);

const attachmentPlaceholder = computed(() => ({
  title: "当前模块附件",
  description: `这里展示 ${currentCategory.value.title} 的原始导入资料和差异说明，方便回溯。`,
}));

const actionItems: QuickActionItem[] = [
  {
    key: "validate",
    label: "立即校验当前模块",
    description: "先扫一遍缺失值、异常值和引用边界，别等到模板选择再暴雷。",
    icon: CheckCircleOutlined,
    tone: "primary",
  },
  {
    key: "compare",
    label: "对比临近项目差异",
    description: "把周边项目和本项目的分层、参数差异拉出来交叉检查。",
    icon: DeploymentUnitOutlined,
  },
  {
    key: "snapshot",
    label: "生成数据快照",
    description: "冻结当前版本，供 AI 生成和审核回溯使用。",
    icon: CameraOutlined,
  },
];

function statusColor(status: CategoryStatus): string {
  if (status === "已完成") {
    return "success";
  }

  if (status === "进行中") {
    return "processing";
  }

  if (status === "待确认") {
    return "warning";
  }

  return "default";
}

function issueColor(level: IssueLevel): string {
  if (level === "阻塞") {
    return "error";
  }

  if (level === "警告") {
    return "warning";
  }

  return "default";
}

function stageColor(status: StageStatus): string {
  if (status === "已完成") {
    return "success";
  }

  if (status === "处理中") {
    return "processing";
  }

  return "warning";
}

function beforeUpload() {
  message.success("文件已加入解析队列，当前为前端演示态。");
  return false;
}
</script>
