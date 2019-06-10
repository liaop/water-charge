<style lang="less">
.search-con-top {
    padding-bottom: 4px;
}
</style>

<template>
    <div>
        <div class="search-con-top">
            <Button type="primary" @click="modalShow = true" icon="md-add"></Button>
        </div>
        <Modal
            v-model="modalShow"
            :closable="false"
            :mask-closable="false"
            :title="modalTitle"
            @on-cancel="modalShow = false"
        >
            <div>
                <Form
                    ref="formValidate"
                    :model="modalParams"
                    :rules="ruleValidate"
                    :label-width="80"
                    @keydown.native.enter.prevent="enterConfirm(modalParams.id)"
                >
                    <FormItem label="户主" prop="house">
                        <Input
                            v-model="modalParams.house"
                            style="width: 350px"
                            placeholder="请输入户主名!"
                        />
                    </FormItem>
                    <FormItem label="联系方式" prop="contact">
                        <Input
                            v-model="modalParams.contact"
                            style="width: 350px"
                            placeholder="请输入联系方式!"
                        />
                    </FormItem>
                    <FormItem label="地址" prop="address">
                        <Input
                            v-model="modalParams.address"
                            style="width: 350px"
                            placeholder="请输入地址!"
                        />
                    </FormItem>
                    <FormItem label="备注" prop="remark">
                        <Input
                            v-model="modalParams.remark"
                            type="textarea"
                            style="width: 350px"
                            :autosize="{minRows: 2,maxRows: 5}"
                            placeholder="请输入备注!"
                        ></Input>
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
            @on-sort-change="sort"
            @on-row-click="tableRowDblClick"
            :loading="tableLoading"
            border
            stripe
            size="large"
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
import util from "../../utils/util";
export default {
    data() {
        return {
            modalShow: false,
            modalBtnLoading: false,
            tableLoading: false,
            dataListTotalCount: 0,
            modalParams: {
                house: "",
                contact: "",
                address: "",
                remark: ""
            },
            ruleValidate: {
                house: [
                    {
                        required: true,
                        message: "户主不能为空!",
                        trigger: "blur"
                    },
                    {
                        max: 8,
                        message: "户主长度8以内！",
                        trigger: "blur"
                    }
                ],
                contact: [
                    {
                        max: 20,
                        message: "联系方式长度20以内！",
                        trigger: "blur"
                    }
                ],
                address: [
                    {
                        required: true,
                        message: "地址不能为空!",
                        trigger: "blur"
                    },
                    {
                        max: 20,
                        message: "地址长度20以内！",
                        trigger: "blur"
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
            searchParams: {},
            search: {
                house: "",
                remark: "",
                sort: "ASC",
                address: "",
                contact: "",
                pageIndex: 1,
                pageSize: 10
            },
            dataList_table_column: [
                {
                    title: "户主",
                    key: "house",
                    align: "center",
                    sortable: "custom",
                    minWidth: 80
                },
                {
                    title: "联系方式",
                    key: "contact",
                    align: "center",
                    minWidth: 150
                },
                {
                    title: "住址",
                    key: "address",
                    align: "center",
                    minWidth: 180
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
                    title: "创建时间",
                    key: "create_time",
                    align: "center",
                    minWidth: 150,
                    render: (h, params) => {
                        return h(
                            "span",
                            util.dateFilter(params.row.create_time)
                        );
                    }
                },
                {
                    title: "修改时间",
                    key: "update_time",
                    align: "center",
                    minWidth: 150,
                    render: (h, params) => {
                        return h(
                            "span",
                            util.dateFilter(params.row.update_time)
                        );
                    }
                },
                {
                    title: "操作",
                    key: "action",
                    width: 140,
                    align: "center",
                    fixed: "right",
                    render: (h, params) => {
                        return h("div", [
                            h("Button", {
                                props: {
                                    type: "primary",
                                    size: "small",
                                    icon: "md-list-box"
                                },
                                attrs: {
                                    title: "查看记录明细"
                                },
                                on: {
                                    click: () => {
                                        this.total(params.row);
                                    }
                                }
                            }),
                            h("Button", {
                                props: {
                                    type: "primary",
                                    size: "small",
                                    icon: "md-create"
                                },
                                attrs: {
                                    title: "修改"
                                },
                                style: {
                                    "margin-left": "5px"
                                },
                                on: {
                                    click: () => {
                                        this.edit(params.row);
                                    }
                                }
                            }),
                            h("Button", {
                                props: {
                                    type: "error",
                                    size: "small",
                                    icon: "md-trash"
                                },
                                attrs: {
                                    title: "删除"
                                },
                                style: {
                                    "margin-left": "5px"
                                },
                                on: {
                                    click: () => {
                                        this.del(params.row);
                                    }
                                }
                            })
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
            if (method === "search") {
                this.searchParams = JSON.parse(JSON.stringify(this.search));
            }
            if (typeof method === "number") {
                this.searchParams.pageIndex = method;
            }
            const searchParams = this.searchParams;
            const where = [];
            let whereSQL = "";
            const pageSQL = `LIMIT ${
                searchParams.pageSize
            } OFFSET ${(searchParams.pageIndex - 1) * searchParams.pageSize} `;
            if (searchParams.house) {
                where.push(`house LIKE '%${searchParams.house}%'`);
            }
            if (searchParams.remark) {
                where.push(`remark LIKE '%${searchParams.remark}%'`);
            }
            if (searchParams.contact) {
                where.push(`contact LIKE '${searchParams.contact}%'`);
            }
            if (searchParams.address) {
                where.push(`address LIKE '%${searchParams.address}%'`);
            }
            if (where.length > 0) {
                whereSQL = "WHERE" + where.join("AND");
            }
            const orderSQL = `ORDER BY id ${searchParams.sort} `;
            const rowSQL =
                "SELECT id,house,contact,address,remark,create_time,update_time FROM PERSON " +
                whereSQL +
                orderSQL +
                pageSQL;
            const countSQL =
                "SELECT COUNT(id) AS totalCount FROM PERSON " + whereSQL;
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
                    this.dataList = res;
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
            this.$refs.formValidate.validate(valid => {
                if (valid) {
                    this.modalBtnLoading = true;
                    const modalParams = this.modalParams;
                    const select = `SELECT COUNT(id) AS totalCount from PERSON WHERE house = '${
                        modalParams.house
                    }'`;
                    this.$db.get(select, (err, res) => {
                        if (err) {
                            this.$logger(err);
                            this.$Notice.error({
                                title: "搜索失败",
                                desc: err
                            });
                        } else {
                            if (res.totalCount) {
                                this.$Message.warning({
                                    content: "该户主已存在"
                                });
                                this.modalBtnLoading = false;
                            } else {
                                const time = Math.round(
                                    new Date().getTime() / 1000
                                );
                                const insert = `INSERT INTO PERSON (house,contact,address,remark,create_time,update_time) VALUES 
                                ('${modalParams.house}','${
                                    modalParams.contact
                                }','${modalParams.address}','${
                                    modalParams.remark
                                }','${time}','${time}')`;
                                this.$logger(insert);
                                this.$db.run(insert, err => {
                                    if (err) {
                                        this.$logger(err);
                                        this.$Notice.error({
                                            title: "新增失败",
                                            desc: err
                                        });
                                    } else {
                                        this.modalShow = false;
                                        this.$Message.success({
                                            content: "新增成功"
                                        });
                                    }
                                    this.modalBtnLoading = false;
                                });
                            }
                        }
                    });
                }
            });
        },
        sort(v) {
            this.search.sort = v.order.toUpperCase();
            this.getDataList("search");
        },
        tableRowDblClick(row) {
            console.log(row);
        },
        getDataListOnPageChange(pageSize) {
            this.search.pageSize = pageSize;
            this.getDataList("search");
        }
    },
    created() {
        this.getDataList("search");
    }
};
</script>
