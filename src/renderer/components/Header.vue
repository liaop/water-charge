<style lang="less">
@import "../assets/less/global.less";

header {
    font-family: "Microsoft YaHei";
    font-size: 14px;
    overflow: hidden;
    background-color: @header-color;
    background: linear-gradient(90deg, @header-color, @bg-color);
    -webkit-app-region: drag;
    .left {
        float: left;
        margin-left: 8px;
    }
    .right {
        float: right;
        a {
            -webkit-app-region: no-drag;
            color: #000;
            margin-right: 10px;
        }
    }
}
</style>

<template>
    <header>
        <section class="left">水费缴费系统</section>
        <section class="right">
            <a href="javascript:void(0)" @click="minWindows">
                <Icon size="14" type="md-remove"></Icon>
            </a>
            <a href="javascript:void(0)" @click="maxWindows">
                <Icon size="14" type="md-resize"></Icon>
            </a>
            <a href="javascript:void(0)" @click="closeWindows">
                <Icon size="14" type="md-close"></Icon>
            </a>
        </section>
    </header>
</template>
<script>
export default {
    data() {
        return {}
    },
    methods: {
        minWindows() {
            this.$electron.ipcRenderer.send("min-window")
        },
        maxWindows() {
            this.$electron.ipcRenderer.send("max-window")
        },
        closeWindows() {
            this.$electron.ipcRenderer.send("close-window")
        },
        update() {}
    },
    created() {
        this.update()
    }
};
</script>
