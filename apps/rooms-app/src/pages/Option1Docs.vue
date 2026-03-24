<template>
  <div class="ax-demo-layout">
    <aside class="ax-demo-sider">
      <div class="ax-demo-brand">
        <div class="ax-demo-brand__title">功能演示</div>
        <div class="ax-demo-brand__sub">Modal · Drawer · Form · Table · …</div>
      </div>

      <a-input-search
        v-model:value="keyword"
        placeholder="搜索功能（如：弹窗、确认、抽屉、表格...）"
        allow-clear
        class="ax-demo-search"
      />

      <a-menu
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        class="ax-demo-menu"
        :items="menuItems"
        @click="onMenuClick"
      />
    </aside>

    <main class="ax-demo-main">
      <section class="ax-demo-section" id="colors">
        <div class="ax-demo-section__title">颜色规范</div>

        <div class="ax-palette">
          <div class="ax-palette__header">
            <div class="ax-palette__title">{{ styleName }}</div>
            <div class="ax-palette__chips">
              <span class="ax-chip" :style="{ background: tokens.accentSoft, color: tokens.accent }">Primary</span>
              <span class="ax-chip" :style="{ background: tokens.secondarySoft, color: tokens.secondary }">Secondary</span>
            </div>
          </div>

          <div class="ax-color-grid">
            <div class="ax-color-card">
              <div class="ax-color-card__label">主题色 Primary</div>
              <div class="ax-color-card__row">
                <span class="ax-swatch" :style="{ background: tokens.accent }" />
                <code class="ax-color-card__code">{{ tokens.accent }}</code>
              </div>
            </div>
            <div class="ax-color-card">
              <div class="ax-color-card__label">主题浅色 Primary Soft</div>
              <div class="ax-color-card__row">
                <span class="ax-swatch" :style="{ background: tokens.accentSoft }" />
                <code class="ax-color-card__code">{{ tokens.accentSoft }}</code>
              </div>
            </div>
            <div class="ax-color-card">
              <div class="ax-color-card__label">辅色 Secondary</div>
              <div class="ax-color-card__row">
                <span class="ax-swatch" :style="{ background: tokens.secondary }" />
                <code class="ax-color-card__code">{{ tokens.secondary }}</code>
              </div>
            </div>
            <div class="ax-color-card">
              <div class="ax-color-card__label">辅色浅色 Secondary Soft</div>
              <div class="ax-color-card__row">
                <span class="ax-swatch" :style="{ background: tokens.secondarySoft }" />
                <code class="ax-color-card__code">{{ tokens.secondarySoft }}</code>
              </div>
            </div>

            <div class="ax-color-card">
              <div class="ax-color-card__label">Success</div>
              <div class="ax-color-card__row">
                <span class="ax-swatch" :style="{ background: tokens.success }" />
                <code class="ax-color-card__code">{{ tokens.success }}</code>
              </div>
            </div>
            <div class="ax-color-card">
              <div class="ax-color-card__label">Warning</div>
              <div class="ax-color-card__row">
                <span class="ax-swatch" :style="{ background: tokens.warning }" />
                <code class="ax-color-card__code">{{ tokens.warning }}</code>
              </div>
            </div>
            <div class="ax-color-card">
              <div class="ax-color-card__label">Danger</div>
              <div class="ax-color-card__row">
                <span class="ax-swatch" :style="{ background: tokens.danger }" />
                <code class="ax-color-card__code">{{ tokens.danger }}</code>
              </div>
            </div>

            <div class="ax-color-card">
              <div class="ax-color-card__label">Background</div>
              <div class="ax-color-card__row">
                <span class="ax-swatch" :style="{ background: tokens.bg }" />
                <code class="ax-color-card__code">{{ tokens.bg }}</code>
              </div>
            </div>
            <div class="ax-color-card">
              <div class="ax-color-card__label">Surface</div>
              <div class="ax-color-card__row">
                <span class="ax-swatch" :style="{ background: tokens.surface }" />
                <code class="ax-color-card__code">{{ tokens.surface }}</code>
              </div>
            </div>
            <div class="ax-color-card">
              <div class="ax-color-card__label">Surface 2</div>
              <div class="ax-color-card__row">
                <span class="ax-swatch" :style="{ background: tokens.surface2 }" />
                <code class="ax-color-card__code">{{ tokens.surface2 }}</code>
              </div>
            </div>
            <div class="ax-color-card">
              <div class="ax-color-card__label">Border</div>
              <div class="ax-color-card__row">
                <span class="ax-swatch" :style="{ background: tokens.border }" />
                <code class="ax-color-card__code">{{ tokens.border }}</code>
              </div>
            </div>
            <div class="ax-color-card">
              <div class="ax-color-card__label">Text</div>
              <div class="ax-color-card__row">
                <span class="ax-swatch ax-swatch--text" :style="{ color: tokens.fg }">Aa</span>
                <code class="ax-color-card__code">{{ tokens.fg }}</code>
              </div>
            </div>
            <div class="ax-color-card">
              <div class="ax-color-card__label">Muted</div>
              <div class="ax-color-card__row">
                <span class="ax-swatch ax-swatch--text" :style="{ color: tokens.muted }">Aa</span>
                <code class="ax-color-card__code">{{ tokens.muted }}</code>
              </div>
            </div>
          </div>

          <div class="ax-preview">
            <div class="ax-preview__row">
              <a-button type="primary">Primary</a-button>
              <a-button class="ax-btn-secondary">Secondary</a-button>
              <a-button>Default</a-button>
              <a-button danger>Danger</a-button>
              <a-button type="link">Link</a-button>
            </div>
            <div class="ax-preview__row">
              <a-tag color="success">success</a-tag>
              <a-tag color="warning">warning</a-tag>
              <a-tag color="error">error</a-tag>
              <a-tag :color="tokens.accent">primary</a-tag>
              <a-tag :color="tokens.secondary">secondary</a-tag>
            </div>
            <div class="ax-preview__row ax-preview__row--inputs">
              <a-input placeholder="输入（看焦点 / 校验色）" />
              <a-select style="width: 220px" :options="spaceOptions" placeholder="选择" />
              <a-button type="primary">应用</a-button>
            </div>
            <div class="ax-preview-tiles">
              <div class="ax-preview-tile" :style="{ background: tokens.accentSoft }">
                <div class="ax-preview-tile__k">选中态</div>
                <div class="ax-preview-tile__v">Primary Soft</div>
              </div>
              <div class="ax-preview-tile" :style="{ background: tokens.secondarySoft }">
                <div class="ax-preview-tile__k">强调块</div>
                <div class="ax-preview-tile__v">Secondary Soft</div>
              </div>
              <div class="ax-preview-tile ax-preview-tile--surface" :style="{ background: tokens.surface }">
                <div class="ax-preview-tile__k">容器</div>
                <div class="ax-preview-tile__v">Surface</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="ax-demo-section" id="overlay">
        <div class="ax-demo-section__title">弹窗 / 确认</div>
        <div class="ax-demo-grid">
          <a-card class="ax-demo-card" title="Modal 弹窗" size="small">
            <a-space>
              <a-button type="primary" @click="modalOpen = true">打开弹窗</a-button>
              <a-button @click="infoOpen = true">信息弹窗</a-button>
            </a-space>

            <a-modal v-model:open="modalOpen" title="结构优化建议" @ok="modalOpen = false">
              <p class="ax-demo-muted">这里可以放生成结果、表单或可视化内容。</p>
            </a-modal>

            <a-modal
              v-model:open="infoOpen"
              title="提示"
              :footer="null"
              @cancel="infoOpen = false"
            >
              <p class="ax-demo-muted">已自动提取关键约束：层高、柱网、净空、预算。</p>
              <a-button type="primary" @click="infoOpen = false">知道了</a-button>
            </a-modal>
          </a-card>

          <a-card class="ax-demo-card" title="Confirm 确认框" size="small">
            <a-space wrap>
              <a-button @click="openConfirm">确认应用</a-button>
              <a-popconfirm
                title="确定删除这条方案吗？"
                ok-text="删除"
                cancel-text="取消"
                @confirm="toast('已删除')"
              >
                <a-button danger>删除</a-button>
              </a-popconfirm>
            </a-space>
            <div class="ax-demo-muted ax-demo-card__desc">
              用于高风险操作：应用、覆盖、删除、发布等。
            </div>
          </a-card>

          <a-card class="ax-demo-card" title="Drawer 抽屉" size="small">
            <a-button type="primary" @click="drawerOpen = true">打开抽屉</a-button>
            <a-drawer v-model:open="drawerOpen" title="材料清单" placement="right">
              <a-list bordered size="small">
                <a-list-item v-for="(item, idx) in materials" :key="idx">
                  {{ item }}
                </a-list-item>
              </a-list>
            </a-drawer>
          </a-card>

          <a-card class="ax-demo-card" title="Message / Notification" size="small">
            <a-space wrap>
              <a-button @click="toast('已保存')">message</a-button>
              <a-button @click="notify()">notification</a-button>
            </a-space>
          </a-card>
        </div>
      </section>

      <section class="ax-demo-section" id="floating">
        <div class="ax-demo-section__title">浮层 / 下拉</div>
        <div class="ax-demo-grid">
          <a-card class="ax-demo-card" title="Tooltip / Popover" size="small">
            <a-space>
              <a-tooltip title="建筑 AI：建议先锁定柱网与动线">
                <a-button>Tooltip</a-button>
              </a-tooltip>
              <a-popover title="提示" content="把约束做成可编辑的表单项，会更可控。">
                <a-button>Popover</a-button>
              </a-popover>
            </a-space>
          </a-card>

          <a-card class="ax-demo-card" title="Dropdown" size="small">
            <a-dropdown>
              <a-button>
                操作菜单
              </a-button>
              <template #overlay>
                <a-menu
                  :items="dropdownItems"
                  @click="onDropdownClick"
                />
              </template>
            </a-dropdown>
          </a-card>
        </div>
      </section>

      <section class="ax-demo-section" id="form">
        <div class="ax-demo-section__title">输入 / 表单</div>
        <div class="ax-demo-grid ax-demo-grid--wide">
          <a-card class="ax-demo-card" title="约束表单" size="small">
            <a-form layout="vertical">
              <a-row :gutter="12">
                <a-col :span="12">
                  <a-form-item label="空间类型">
                    <a-select v-model:value="form.space" :options="spaceOptions" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="预算（万）">
                    <a-input-number v-model:value="form.budget" :min="0" style="width: 100%" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="偏好风格">
                    <a-radio-group v-model:value="form.tone">
                      <a-radio value="简约">简约</a-radio>
                      <a-radio value="工业">工业</a-radio>
                      <a-radio value="温润">温润</a-radio>
                    </a-radio-group>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="交付物">
                    <a-checkbox-group v-model:value="form.outputs" :options="outputOptions" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-space>
                <a-button @click="resetForm">重置</a-button>
                <a-button type="primary" @click="toast('已提交')">提交</a-button>
              </a-space>
            </a-form>
          </a-card>
        </div>
      </section>

      <section class="ax-demo-section" id="data">
        <div class="ax-demo-section__title">数据展示</div>
        <div class="ax-demo-grid ax-demo-grid--wide">
          <a-card class="ax-demo-card" title="Table 表格" size="small">
            <a-table
              :columns="columns"
              :data-source="rows"
              size="small"
              :pagination="{ pageSize: 5 }"
              row-key="key"
            />
          </a-card>
        </div>
      </section>

      <section class="ax-demo-section" id="progress">
        <div class="ax-demo-section__title">步骤 / 进度 / 结果</div>
        <div class="ax-demo-grid">
          <a-card class="ax-demo-card" title="Steps" size="small">
            <a-steps :current="step" size="small">
              <a-step title="解析" />
              <a-step title="生成" />
              <a-step title="校验" />
              <a-step title="输出" />
            </a-steps>
            <div class="ax-demo-card__footer">
              <a-button @click="step = Math.max(0, step - 1)">上一步</a-button>
              <a-button type="primary" @click="step = Math.min(3, step + 1)">下一步</a-button>
            </div>
          </a-card>

          <a-card class="ax-demo-card" title="Progress" size="small">
            <a-progress :percent="progress" />
            <a-slider v-model:value="progress" :min="0" :max="100" />
          </a-card>

          <a-card class="ax-demo-card" title="Result" size="small">
            <a-result status="success" title="已生成结果" sub-title="可以继续导出、应用或二次编辑。">
              <template #extra>
                <a-button>查看</a-button>
                <a-button type="primary">导出</a-button>
              </template>
            </a-result>
          </a-card>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from "vue";
import { Modal, message, notification } from "ant-design-vue";

export default defineComponent({
  name: "Option1Docs",
  setup() {
    const keyword = ref("");
    const selectedKeys = ref<string[]>(["colors"]);

    const menuItems = computed(
      () =>
        [
          { key: "colors", label: "颜色规范" },
          { key: "overlay", label: "弹窗 / 确认" },
          { key: "floating", label: "浮层 / 下拉" },
          { key: "form", label: "输入 / 表单" },
          { key: "data", label: "数据展示" },
          { key: "progress", label: "步骤 / 进度 / 结果" },
        ] as any,
    );

    const modalOpen = ref(false);
    const infoOpen = ref(false);
    const drawerOpen = ref(false);

    const step = ref(1);
    const progress = ref(36);

    const materials = ref<string[]>([
      "铝板吊顶（哑光）",
      "微水泥地面（浅灰）",
      "木饰面墙（暖白）",
      "线性灯带（4000K）",
    ]);

    const dropdownItems = [
      { key: "apply", label: "应用到方案" },
      { key: "export", label: "导出报告" },
      { key: "share", label: "分享链接" },
    ];

    const form = ref({
      space: "大堂",
      budget: 120,
      tone: "简约",
      outputs: ["清单", "风险"],
    });

    const spaceOptions = [
      { value: "大堂", label: "大堂" },
      { value: "会议室", label: "会议室" },
      { value: "办公区", label: "办公区" },
    ];

    const outputOptions = [
      { value: "清单", label: "清单" },
      { value: "风险", label: "风险" },
      { value: "对比", label: "对比" },
    ];

    const columns = [
      { title: "项目", dataIndex: "name", key: "name" },
      { title: "建议", dataIndex: "value", key: "value" },
      { title: "置信度", dataIndex: "score", key: "score" },
    ];

    const rows = [
      { key: "1", name: "动线", value: "入口—前台—等候分区清晰", score: "0.86" },
      { key: "2", name: "照明", value: "主光 4000K + 重点洗墙", score: "0.79" },
      { key: "3", name: "材料", value: "微水泥 + 木饰面，低维护", score: "0.82" },
      { key: "4", name: "声学", value: "局部吸音顶 + 软包", score: "0.68" },
      { key: "5", name: "安全", value: "疏散指示与消防间距复核", score: "0.74" },
      { key: "6", name: "成本", value: "预算建议 100–140 万", score: "0.71" },
    ];

    const tokens = ref({
      accent: "",
      accentSoft: "",
      secondary: "",
      secondarySoft: "",
      bg: "",
      surface: "",
      surface2: "",
      border: "",
      fg: "",
      muted: "",
      success: "",
      warning: "",
      danger: "",
    });

    const styleName = computed(() => {
      const root = document.getElementById("rooms-app");
      const cls = root?.className ?? "";
      if (cls.includes("rooms-style-2")) {
        return "风格2";
      }
      if (cls.includes("rooms-style-3")) {
        return "风格3";
      }
      return "风格1";
    });

    function readCssVar(style: CSSStyleDeclaration, name: string): string {
      return style.getPropertyValue(name).trim();
    }

    function refreshTokens(): void {
      const root = document.getElementById("rooms-app");
      if (!root) return;
      const style = getComputedStyle(root);
      tokens.value = {
        accent: readCssVar(style, "--rooms-accent"),
        accentSoft: readCssVar(style, "--rooms-accent-soft"),
        secondary: readCssVar(style, "--rooms-secondary"),
        secondarySoft: readCssVar(style, "--rooms-secondary-soft"),
        bg: readCssVar(style, "--rooms-bg"),
        surface: readCssVar(style, "--rooms-surface"),
        surface2: readCssVar(style, "--rooms-surface-2"),
        border: readCssVar(style, "--rooms-border"),
        fg: readCssVar(style, "--rooms-fg"),
        muted: readCssVar(style, "--rooms-muted"),
        success: readCssVar(style, "--rooms-success"),
        warning: readCssVar(style, "--rooms-warning"),
        danger: readCssVar(style, "--rooms-danger"),
      };
    }

    let observer: MutationObserver | null = null;

    onMounted(() => {
      refreshTokens();
      const root = document.getElementById("rooms-app");
      if (!root) return;
      observer = new MutationObserver(() => refreshTokens());
      observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    });

    onBeforeUnmount(() => {
      observer?.disconnect();
      observer = null;
    });

    function toast(text: string): void {
      message.success(text);
    }

    function notify(): void {
      notification.open({
        message: "生成完成",
        description: "已输出 3 套方案，你可以继续确认约束或导出报告。",
      });
    }

    function openConfirm(): void {
      Modal.confirm({
        title: "确认应用本次结果？",
        content: "将覆盖当前草稿配置，可在历史记录中回滚。",
        okText: "应用",
        cancelText: "取消",
        onOk: () => toast("已应用"),
      });
    }

    function onDropdownClick(info: { key: string }): void {
      toast(`点击：${info.key}`);
    }

    function scrollTo(id: string): void {
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function onMenuClick(info: any): void {
      const key = String(info?.key ?? "");
      if (!key) return;
      selectedKeys.value = [key];
      scrollTo(key);
    }

    function resetForm(): void {
      form.value = {
        space: "大堂",
        budget: 120,
        tone: "简约",
        outputs: ["清单", "风险"],
      };
    }

    return {
      keyword,
      selectedKeys,
      menuItems,
      onMenuClick,
      tokens,
      styleName,
      modalOpen,
      infoOpen,
      drawerOpen,
      openConfirm,
      toast,
      notify,
      materials,
      dropdownItems,
      onDropdownClick,
      form,
      spaceOptions,
      outputOptions,
      columns,
      rows,
      step,
      progress,
      resetForm,
    };
  },
});
</script>

<style scoped>
.ax-demo-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 16px;
}

.ax-demo-sider {
  position: sticky;
  top: 0;
  align-self: start;
  height: calc(100vh - var(--rooms-header-height) - 32px);
  padding: 14px;
  background: var(--rooms-surface);
  border: 1px solid var(--rooms-border);
  border-radius: 14px;
  overflow: auto;
}

.ax-demo-brand__title {
  font-weight: 800;
  color: var(--rooms-fg);
  letter-spacing: 0.2px;
}

.ax-demo-brand__sub {
  margin-top: 4px;
  color: var(--rooms-muted);
  font-size: 12px;
}

.ax-demo-search {
  margin: 10px 0 12px;
}

.ax-demo-menu {
  background: transparent;
  border-inline-end: none;
}

.ax-demo-main {
  min-width: 0;
}

.ax-demo-section {
  padding: 14px 14px 16px;
  border: 1px solid var(--rooms-border);
  border-radius: 14px;
  background: var(--rooms-surface);
}

.ax-demo-section + .ax-demo-section {
  margin-top: 12px;
}

.ax-demo-section__title {
  font-weight: 700;
  color: var(--rooms-fg);
  margin-bottom: 10px;
}

.ax-color-grid {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.ax-color-card {
  border: 1px solid var(--rooms-border);
  border-radius: 12px;
  padding: 10px 10px 12px;
  background: var(--rooms-surface-2);
}

.ax-color-card__label {
  font-size: 12px;
  color: var(--rooms-muted);
  margin-bottom: 8px;
}

.ax-color-card__row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ax-swatch {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid var(--rooms-border);
  display: inline-block;
}

.ax-swatch--text {
  display: grid;
  place-items: center;
  background: var(--rooms-surface);
  font-weight: 800;
}

.ax-color-card__code {
  font-size: 12px;
  color: var(--rooms-fg);
}

.ax-palette {
  border: 1px dashed var(--rooms-border);
  border-radius: 14px;
  padding: 12px;
  background: var(--rooms-surface-2);
}

.ax-palette__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 6px;
}

.ax-palette__title {
  font-weight: 800;
  color: var(--rooms-fg);
}

.ax-palette__chips {
  display: flex;
  gap: 8px;
}

.ax-chip {
  border: 1px solid var(--rooms-border);
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 700;
}

.ax-preview {
  margin-top: 10px;
  display: grid;
  gap: 10px;
}

.ax-preview__row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.ax-preview__row--inputs {
  display: grid;
  grid-template-columns: 1fr 220px auto;
  gap: 10px;
  align-items: center;
}

.ax-preview-tiles {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.ax-preview-tile {
  border: 1px solid var(--rooms-border);
  border-radius: 12px;
  padding: 10px 12px;
  color: var(--rooms-fg);
}

.ax-preview-tile--surface {
  background: var(--rooms-surface) !important;
}

.ax-preview-tile__k {
  font-size: 12px;
  color: var(--rooms-muted);
}

.ax-preview-tile__v {
  margin-top: 2px;
  font-weight: 700;
}

.ax-btn-secondary {
  border-color: var(--rooms-secondary) !important;
  color: var(--rooms-secondary) !important;
  background: transparent !important;
}

.ax-btn-secondary:hover {
  background: var(--rooms-secondary-soft) !important;
}

.ax-demo-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 8px;
}

.ax-demo-grid--wide {
  grid-template-columns: 1fr;
}

.ax-demo-card {
  background: var(--rooms-surface);
  border-color: var(--rooms-border);
}

.ax-demo-card__desc {
  margin-top: 10px;
}

.ax-demo-card__footer {
  margin-top: 12px;
  display: flex;
  gap: 10px;
}

.ax-demo-muted {
  color: var(--rooms-muted);
}

@media (max-width: 980px) {
  .ax-demo-layout {
    grid-template-columns: 1fr;
  }

  .ax-demo-sider {
    position: relative;
    height: auto;
  }

  .ax-demo-grid {
    grid-template-columns: 1fr;
  }

  .ax-color-grid {
    grid-template-columns: 1fr;
  }
}
</style>

