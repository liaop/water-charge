<template>
    <Tabs v-model="cur" type="card" @on-tab-remove="closeTab">
        <TabPane
            closable
            v-for="tab in tabs"
            :name="tab.value.toString()"
            :key="tab.value"
            :label="tab.label"
        >
            <Content :id="tab.value"></Content>
        </TabPane>
        <Select
            slot="extra"
            :label-in-value="true"
            :transfer="true"
            @on-change="openDetail"
            filterable
        >
            <Option v-for="house in houses" :value="house.id" :key="house.id">{{ house.house }}</Option>
        </Select>
    </Tabs>
</template>
<script>
import Content from "./RecordContent";
export default {
    data() {
        return {
            houses: [],
            tabs: [],
            cur: 0
        };
    },
    components: {
        Content
    },
    methods: {
        getHouses() {
            const select = "SELECT id,house FROM PERSON";
            this.$logger(select);
            this.$db.all(select, (err, res) => {
                if (err) {
                    this.$logger(err);
                    this.$Notice.error({
                        title: "查询失败",
                        desc: err
                    });
                } else {
                    this.houses = res;
                }
            });
        },
        closeTab(v) {
            const arr = this.tabs.filter(item => parseInt(v) !== item.value);
            this.tabs = arr;
            sessionStorage.setItem("list", JSON.stringify(arr));
        },
        openDetail(v) {
            if (!this.tabs.find(item => item.value === v.value)) {
                this.tabs.push(v);
                this.cur = v.value.toString();
                sessionStorage.setItem("list", JSON.stringify(this.tabs));
            } else {
                this.tabs.map(item => {
                    if (item.value === v.value)
                        this.cur = item.value.toString();
                });
            }
        }
    },
    created() {
        this.getHouses();
        if (sessionStorage.getItem("list")) {
            this.tabs = JSON.parse(sessionStorage.getItem("list"));
        }
    }
};
</script>
