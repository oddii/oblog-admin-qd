<template>
  <div class="table-bar-wrapper">
      <!--搜索区域-->
      <div class="search-wrapper">
        <el-input class="search-input" size="medium" placeholder="请输入内容">
          <el-button slot="append" icon="el-icon-search"/>
        </el-input>
      </div>

      <!--新增区域-->
      <div class="insert-wrapper">
        <el-button size="medium" icon="el-icon-plus" type="primary">
          {{title}}
        </el-button>
      </div>
  </div>
</template>

<script>
export default {
  name: 'table-bar',
  props: ['title']
}
</script>

<style lang="less" scoped>
.table-bar-wrapper{
  margin-bottom: 15px;
  display: flex;

  .search-wrapper{
    margin-right: 20px;
    .search-input{
      width: 300px;
    }
  }
}
</style>
