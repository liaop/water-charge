<style lang="less">
.search-con-top {
    padding-bottom: 4px;
}
</style>

<template>
    <div>
        <div class="search-con-top">
            <Input
                icon="md-sync"
                v-model="price"
                @on-click="setPrice"
                prefix="logo-yen"
                style="width:90px"
            />
            <Button type="primary" @click="add" icon="md-add"></Button>
        </div>
        <Modal
            v-model="modalShow"
            :mask-closable="false"
            :closable="false"
            @on-cancel="modalShow = false"
            :title="modalTitle"
        >
            <div>
                <Form
                    ref="formVali"
                    :model="modalParams"
                    :rules="ruleValidate"
                    label-position="right"
                    :label-width="80"
                    @keydown.native.enter.prevent="enterConfirm(modalParams.id)"
                >
                    <FormItem label="抄表数" prop="count">
                        <Input
                            v-model="modalParams.count"
                            placeholder="请输入抄表数!"
                            style="width: 350px"
                        />
                    </FormItem>
                    <FormItem label="重置" prop="end">
                        <RadioGroup v-model="modalParams.end">
                            <Radio label="1">是</Radio>
                            <Radio label="0">否</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem v-if="parseInt(modalParams.end)===1" label="上限值" prop="upper">
                        <Input
                            v-model="modalParams.upper"
                            placeholder="请输入上限值!"
                            style="width: 350px"
                        />
                    </FormItem>
                    <FormItem label="水价" prop="price">
                        <Input
                            v-model="modalParams.price"
                            placeholder="请输水价!"
                            style="width: 350px"
                        />
                    </FormItem>
                    <FormItem label="抄表日期" prop="date">
                        <DatePicker
                            type="date"
                            v-model="modalParams.date"
                            format="yyyy年MM月dd日"
                            placeholder="请选择日期!"
                            style="width: 350px"
                        />
                    </FormItem>
                    <FormItem label="备注" prop="remark">
                        <Input
                            v-model="modalParams.remark"
                            type="textarea"
                            :autosize="{minRows: 2,maxRows: 5}"
                            placeholder="请输入备注!"
                            style="width: 350px"
                        />
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button @click="modalShow = false">取消</Button>
                <Button
                    type="primary"
                    v-if="!modalParams.id"
                    @click="addConfirm"
                    :loading="modalBtnLoading"
                >确认</Button>
                <Button
                    type="primary"
                    v-if="modalParams.id"
                    @click="editConfirm"
                    :loading="modalBtnLoading"
                >确认</Button>
            </div>
        </Modal>
        <Table
            :loading="tableLoading"
            border
            stripe
            :columns="dataList_table_column"
            :data="dataList"
        />
        <Page
            :total="dataListTotalCount"
            :current="searchParams.pageIndex"
            :page-size="searchParams.pageSize"
            @on-change="getDataList"
            @on-page-size-change="getDataListOnPageChange"
            :page-size-opts="[10,20,30,50,120]"
            show-total
            show-sizer
            show-elevator
            transfer
        />
    </div>
</template>
<script>
import { getRegexp, time } from "../../utils/util";
import { match } from "minimatch";
export default {
    data() {
        return {
            modalShow: false,
            tableLoading: false,
            modalBtnLoading: false,
            dataListTotalCount: 0,
            price: null,
            statusList: [
                { key: 1, name: "未收款" },
                { key: 2, name: "已付款" },
                { key: 0, name: "底数" }
            ],
            modalParams: {
                count: "",
                end: "0",
                upper: "0",
                price: "0",
                date: "",
                remark: ""
            },
            ruleValidate: {
                count: [
                    {
                        required: true,
                        message: "抄表数不能为空!",
                        trigger: "blur"
                    },
                    {
                        type: "number",
                        message: "请输入数字值!",
                        trigger: "blur",
                        transform: v => Number(v)
                    }
                ],
                end: [
                    {
                        required: true,
                        message: "是否重置不能为空!",
                        trigger: "change"
                    },
                    {
                        type: "enum",
                        enum: ["0", "1"],
                        message: "必须为布尔型！",
                        trigger: "change"
                    }
                ],
                upper: [
                    {
                        required: true,
                        message: "上限值不能为空!",
                        trigger: "blur"
                    },
                    {
                        type: "number",
                        message: "请输入数字值!",
                        trigger: "blur",
                        transform: v => Number(v)
                    }
                ],
                price: [
                    {
                        required: true,
                        message: "水价不为空!",
                        trigger: "blur"
                    },
                    {
                        type: "number",
                        message: "请输入数字值!",
                        trigger: "blur",
                        transform: v => parseFloat(v)
                    }
                ],
                date: [
                    {
                        required: true,
                        type: "date",
                        message: "日期类型!",
                        trigger: "change"
                    }
                ],
                remark: [
                    {
                        max: 20,
                        message: "备注长度20以内！",
                        trigger: "blur"
                    }
                ]
            },
            search: {
                order: "date",
                sort: "DESC",
                pageIndex: 1,
                pageSize: 10
            },
            searchParams: {},
            dataList_table_column: [
                {
                    type: "selection",
                    minWidth: 30,
                    align: "center",
                    fixed: "left"
                },
                {
                    title: "抄表日期",
                    key: "date",
                    align: "center",
                    sortable: "true",
                    minWidth: 120,
                    render: (h, params) => {
                        const date = new Date(params.row.date * 1000);
                        return h(
                            "div",
                            date.getFullYear() +
                                "-" +
                                (date.getMonth() + 1) +
                                "-" +
                                date.getDate()
                        );
                    }
                },
                {
                    title: "水表读数(方)",
                    key: "count",
                    align: "center",
                    minWidth: 80
                },
                {
                    title: "用水量(方)",
                    key: "total",
                    align: "center",
                    minWidth: 80
                },
                {
                    title: "单价(元)",
                    key: "price",
                    align: "center",
                    minWidth: 80
                },
                {
                    title: "合币(元)",
                    key: "account",
                    align: "center",
                    minWidth: 80,
                    render: (h, params) => {
                        return h(
                            "div",
                            Math.round(
                                params.row.total * params.row.price * 100
                            ) / 100
                        );
                    }
                },
                {
                    title: "状态",
                    key: "status",
                    align: "center",
                    minWidth: 80,
                    render: (h, params) => {
                        if (params.row.status === 1) {
                            return h(
                                "div",
                                { style: { color: "red" } },
                                "未收款"
                            );
                        } else if (params.row.status === 2) {
                            return h(
                                "div",
                                { style: { color: "green" } },
                                "已付款"
                            );
                        }
                        return h("div", { style: { color: "blue" } }, "底数");
                    }
                },
                {
                    title: "备注",
                    key: "remark",
                    align: "center",
                    minWidth: 180,
                    render: (h, params) => {
                        const remark = params.row.remark;
                        if (remark) {
                            return h(
                                "Tooltip",
                                {
                                    class: {
                                        "table-tooltip": true
                                    },
                                    props: {
                                        delay: 800
                                    }
                                },
                                [
                                    h("div", remark),
                                    h(
                                        "div",
                                        {
                                            style: {
                                                "white-space": "normal"
                                            },
                                            slot: "content"
                                        },
                                        remark
                                    )
                                ]
                            );
                        }
                    }
                },
                {
                    title: "操作",
                    key: "action",
                    width: 130,
                    align: "center",
                    fixed: "right",
                    render: (h, params) => {
                        return h("div", [
                            h("Button", {
                                props: {
                                    type: "primary",
                                    size: "small",
                                    icon: "md-create"
                                },
                                attrs: {
                                    title: "编辑"
                                },
                                on: {
                                    click: () => {
                                        this.edit(params.row);
                                    }
                                }
                            }),
                            h(
                                "Poptip",
                                {
                                    props: {
                                        confirm: true,
                                        transfer: true,
                                        title: "你确定要删除吗？"
                                    },
                                    style: {
                                        textAlign: "left"
                                    },
                                    on: {
                                        "on-ok": () => {
                                            this.del(params.row.id);
                                        }
                                    }
                                },
                                [
                                    h("Button", {
                                        props: {
                                            type: "error",
                                            size: "small",
                                            icon: "md-trash"
                                        },
                                        style: {
                                            "margin-left": "5px"
                                        },
                                        attrs: {
                                            title: "删除"
                                        }
                                    })
                                ]
                            )
                        ]);
                    }
                }
            ],
            dataList: []
        };
    },
    computed: {
        modalTitle() {
            return this.modalParams.id ? "修改" : "添加";
        }
    },
    methods: {
        getDataList(method) {
            this.tableLoading = true;
            this.searchParams = JSON.parse(JSON.stringify(this.search));
            if (typeof method === "number") {
                this.search.pageIndex = method;
                this.searchParams.pageIndex = method;
            } else {
                this.search.pageIndex = 1;
            }
            const searchParams = this.searchParams;
            const where = [];
            let whereSQL = "WHERE person_id=" + this.id;
            const pageSQL = `LIMIT ${
                searchParams.pageSize
            } OFFSET ${(searchParams.pageIndex - 1) * searchParams.pageSize} `;
            const orderSQL = ` ORDER BY ${searchParams.order} ${
                searchParams.sort
            } `;
            const rowSQL =
                "SELECT id,status,count,price,total,pre,date,end,upper,create_time,remark FROM RECORD " +
                whereSQL +
                orderSQL +
                pageSQL;
            const countSQL =
                "SELECT COUNT(id) AS totalCount FROM RECORD " + whereSQL;
            this.$logger(rowSQL);
            this.$logger(countSQL);
            this.$db.all(rowSQL, (err, res) => {
                if (err) {
                    this.$logger(err);
                    this.$Notice.error({
                        title: "搜索失败",
                        desc: err
                    });
                } else {
                    this.dataList = res.reverse();
                }
                this.tableLoading = false;
            });
            this.$db.get(countSQL, (err, res) => {
                if (err) {
                    this.$logger(err);
                    this.$Notice.error({
                        title: "搜索失败",
                        desc: err
                    });
                } else {
                    this.dataListTotalCount = res.totalCount;
                }
            });
        },
        addConfirm() {
            this.$refs.formVali.validate(valid => {
                if (valid) {
                    this.modalBtnLoading = true;
                    const modalParams = this.modalParams;
                    const date = Math.round(modalParams.date.getTime() / 1000);
                    const pre = `SELECT id,count,total,date FROM RECORD WHERE person_id=${
                        this.id
                    } AND date < ${date} ORDER BY date DESC LIMIT 1 OFFSET 0`;
                    const next = `SELECT id,count,status,end,upper FROM RECORD WHERE person_id=${
                        this.id
                    } AND date > ${date} ORDER BY date ASC LIMIT 1 OFFSET 0`;
                    this.$db.serialize(() => {
                        this.$logger(next);
                        this.$db.get(next, (err, res) => {
                            if (err) {
                                this.$logger(err);
                                this.$Notice.error({
                                    title: "查询失败",
                                    desc: err
                                });
                            } else {
                                if (typeof res !== "undefined") {
                                    let total;
                                    if (res.end) {
                                        total =
                                            res.upper -
                                            modalParams.count +
                                            res.count;
                                    } else {
                                        total = res.count - modalParams.count;
                                    }
                                    const status =
                                        res.status === 0 ? 1 : res.status;
                                    const nextSql = `UPDATE RECORD SET total=${total}, pre=${date}, status=${status} WHERE id=${
                                        res.id
                                    }`;
                                    this.$logger(nextSql);
                                    this.$db.run(nextSql, err => {
                                        if (err) {
                                            this.$logger(err);
                                            this.$Notice.error({
                                                title: "更新失败",
                                                desc: err
                                            });
                                        }
                                    });
                                }
                            }
                        });
                        this.$logger(pre);
                        this.$db.get(pre, (err, res) => {
                            if (err) {
                                this.$logger(err);
                                this.$Notice.error({
                                    title: "查询失败",
                                    desc: err
                                });
                            } else {
                                let status, pre, total;
                                if (typeof res === "undefined") {
                                    status = 0;
                                    pre = 0;
                                    total = 0;
                                } else {
                                    status = 1;
                                    pre = res.date;
                                    if (modalParams.end) {
                                        total =
                                            parseInt(modalParams.upper) -
                                            res.count +
                                            parseInt(modalParams.count);
                                    } else {
                                        total = modalParams.count - res.count;
                                    }
                                }
                                const insert = `INSERT INTO RECORD (person_id,status,count,price,total,pre,date,end,upper,remark,create_time) VALUES (${
                                    this.id
                                },${status},${modalParams.count},${
                                    modalParams.price
                                },${total},${pre},${date},${modalParams.end},${
                                    modalParams.upper
                                },'${modalParams.remark}',${time})`;
                                this.$logger(insert);
                                this.$db.exec(insert, err => {
                                    if (err) {
                                        this.$logger(err);
                                        this.$Notice.error({
                                            title: "添加失败",
                                            desc: err
                                        });
                                    } else {
                                        this.modalShow = false;
                                        this.$Message.success({
                                            content: "新增成功"
                                        });
                                        this.getDataList();
                                    }
                                    this.modalBtnLoading = false;
                                });
                            }
                        });
                    });
                }
            });
        },
        editConfirm() {},
        add() {
            this.$refs.formVali.resetFields();
            this.modalParams.price = this.price;
            this.modalParams.upper = "0";
            this.modalShow = true;
        },
        del(id) {
            const del = `DELETE FROM RECORD WHERE id = ${id}`;
            this.$logger(del);
            this.$db.run(del, err => {
                if (err) {
                    this.$logger(err);
                    this.$Notice.error({
                        title: "删除失败",
                        desc: err
                    });
                } else {
                    this.$Message.success({
                        content: "删除成功"
                    });
                    this.getDataList();
                }
            });
        },
        setPrice() {
            if (getRegexp("money").test(this.price)) {
                const SQL = `INSERT INTO UNIT (price,time) VALUES ('${
                    this.price
                }','${time}')`;
                this.$logger(SQL);
                this.$db.run(SQL, err => {
                    if (err) {
                        this.$logger(err);
                        this.$Notice.error({
                            title: "新增失败",
                            desc: err
                        });
                    } else {
                        this.$Message.success({
                            content: "新增成功"
                        });
                    }
                });
            } else {
                this.$Message.error("水价设置错误！");
            }
        },
        getPrice() {
            const sql = "SELECT price FROM UNIT ORDER BY id DESC LIMIT 0,1";
            this.$logger(sql);
            this.$db.get(sql, (err, res) => {
                if (err) {
                    this.$logger(err);
                    this.$Notice.error({
                        title: "搜索失败",
                        desc: err
                    });
                } else {
                    if (typeof res === "undefined") {
                        this.price = null;
                    } else {
                        this.price = res.price.toString();
                    }
                }
            });
        },
        getDataListOnPageChange(pageSize) {
            this.search.pageSize = pageSize;
            this.getDataList();
        }
    },
    created() {
        this.getDataList();
        this.getPrice();
    },
    props: {
        id: {
            type: Number,
            required: true
        }
    }
};
</script>
