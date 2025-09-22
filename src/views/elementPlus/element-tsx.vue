<script lang="ts">
import { defineComponent } from 'vue'
import { ElTable, ElTableColumn } from 'element-plus'
export default defineComponent({
  name: 'ElementTSX',
  components: {
    ElTable,
    ElTableColumn,
  },
  data() {
    return {
      tableData: [
        { id: 1, name: '张三', age: 28, email: 'zhangsan@example.com', status: 'active' },
        { id: 2, name: '李四', age: 32, email: 'lisi@example.com', status: 'inactive' },
        { id: 3, name: '王五', age: 24, email: 'wangwu@example.com', status: 'pending' },
        { id: 4, name: '赵六', age: 35, email: 'zhaoliu@example.com', status: 'active' },
      ],
      tableProps: {
        data: this.tableData,
        border: true,
        stripe: true,
        style: { width: '100%' },
      },
    }
  },
  render() {
    console.log("========================render")
    // return (
    //   <div className="table-container">
    //     <ElTable {...tableProps}>
    //       <ElTableColumn type="index" label="序号" width={80} />
    //       <ElTableColumn prop="name" label="姓名" width={120} />
    //       <ElTableColumn prop="age" label="年龄" width={80} />
    //       <ElTableColumn prop="email" label="邮箱" />
    //       <ElTableColumn prop="status" label="状态" width={120}>
    //         {{ default: ({ row }) => (
    //           <span class={`status-tag status-${row.status}`}>
    //             {row.status === 'active' ? '活跃' : row.status === 'inactive' ? '禁用' : '待审核'}
    //           </span>
    //         )}}
    //       </ElTableColumn>
    //     </ElTable>
    //   </div>
    // );
  }
});
</script>

<style scoped>
.table-container {
  padding: 20px;
}

.status-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-active {
  background-color: #f0f9eb;
  color: #52c41a;
}

.status-inactive {
  background-color: #fef2f2;
  color: #ff4d4f;
}

.status-pending {
  background-color: #fffbe6;
  color: #faad14;
}
</style>