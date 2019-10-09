<template>
  <div class="app-container clearfix">
    <div class="left">
      <h4>博士知识库</h4>
      <el-tree :data="treeData" :props="defaultProps" default-expand-all :expand-on-click-node="false" @node-click="handleNodeClick" />
    </div>
    <div class="right">
      <div id="topSearch">
        <el-input v-model="searchVal" placeholder="请输入租户名称">
          <el-button slot="append" type="primary" icon="el-icon-search" />
        </el-input>
        <el-popover
          v-model="popoverVisible"
          placement="bottom-start"
          title="高级搜索"
          width="500"
          :visible-arrow="false"
          trigger="click"
          popper-class="advancedSearch"
        >
          <el-form ref="form" :model="searchObj" label-width="80px">
            <el-form-item label="ID">
              <el-input v-model="searchObj.id" />
            </el-form-item>
            <el-form-item label="标识">
              <el-input v-model="searchObj.identify" />
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="searchObj.type" placeholder="请选择类型">
                <el-option v-for="item in type" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-form>

          <div id="searchPopoverBtn">
            <el-button type="primary" @click="topSearch">搜索</el-button>
            <el-button type="primary" plain @click="searchObj = {}">重置</el-button>
          </div>

          <span id="advancedSearch" slot="reference">高级搜索<i class="el-icon-caret-bottom" /></span>
        </el-popover>
      </div>
      <div id="topBtn">
        <el-button type="primary" @click="add"><i class="iconfont iconjia"></i>新增</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="ID" width="60">
          <template slot-scope="scope">
            {{ scope.$index }}
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="名称">
          <template slot-scope="scope">
            <span class="pointer" @click="detail(scope.row.id)">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标识" width="150" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.author }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图片" width="110" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.pageviews }}
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="路径" width="200" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip prop="created_at" label="类型" width="200">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.display_time }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="操作" width="280" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button size="mini" @click="edit(scope.row.id)"><i class="iconfont iconxiugai"></i>修改</el-button>
            <el-button size="mini" @click="del(scope.row.id)"><i class="iconfont iconxiugai"></i>删除</el-button>
            <el-dropdown>
              <el-button size="mini">
                <i class="iconfont icongengduo"></i>更多
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>上移</el-dropdown-item>
                <el-dropdown-item>下移</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="fetchData" />
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      searchObj: {
        id: null,
        identify: null,
        type: null
      },
      type: [
        {
          id: 1,
          name: '类型1'
        },
        {
          id: 2,
          name: '类型2'
        },
        {
          id: 3,
          name: '类型3'
        }
      ],
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      searchVal: '',
      popoverVisible: false,
      treeData: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      const response = { 'code': 20000, 'data': { 'total': 100, 'items': [{ 'id': 1, 'timestamp': 1541030427737, 'author': 'Thomas', 'reviewer': 'David', 'title': 'Jgul Rcvcirl Ivosfee Fwjwqr Tozkukj Vrckevtm', 'content_short': 'mock data', 'content': '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>', 'forecast': 44.86, 'importance': 2, 'type': 'EU', 'status': 'published', 'display_time': '1971-10-12 09:20:18', 'comment_disabled': true, 'pageviews': 2709, 'image_uri': 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3', 'platforms': ['a-platform'] }, { 'id': 2, 'timestamp': 1164914315046, 'author': 'Susan', 'reviewer': 'Kevin', 'title': 'Dycu Txqhhl Glojld Hgyb Uvnbgos Ixbncn Msvutjabo Hckk Tlafie', 'content_short': 'mock data', 'content': '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>', 'forecast': 27.54, 'importance': 1, 'type': 'EU', 'status': 'published', 'display_time': '1976-06-30 01:55:44', 'comment_disabled': true, 'pageviews': 3825, 'image_uri': 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3', 'platforms': ['a-platform'] }, { 'id': 3, 'timestamp': 272546328539, 'author': 'Helen', 'reviewer': 'Christopher', 'title': 'Ussvekitj Ttuyvats Jhofmuvwn Eyna Pqydmv Iymbkchn Aknnx Wsbrpdbjl', 'content_short': 'mock data', 'content': '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>', 'forecast': 90.04, 'importance': 2, 'type': 'JP', 'status': 'published', 'display_time': '2007-10-02 20:38:58', 'comment_disabled': true, 'pageviews': 2169, 'image_uri': 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3', 'platforms': ['a-platform'] }, { 'id': 4, 'timestamp': 440903009031, 'author': 'Gary', 'reviewer': 'Robert', 'title': 'Sbqfa Refow Wypbubf Bzwbhjmu Huhxh Wjgqfz Wqcxdr', 'content_short': 'mock data', 'content': '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>', 'forecast': 89.57, 'importance': 3, 'type': 'EU', 'status': 'deleted', 'display_time': '1998-03-09 11:55:09', 'comment_disabled': true, 'pageviews': 827, 'image_uri': 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3', 'platforms': ['a-platform'] }, { 'id': 5, 'timestamp': 885152447273, 'author': 'Nancy', 'reviewer': 'Kevin', 'title': 'Twuthgkw Bhrsapj Qmufwy Ekbif Kxojkg Xisan Cdenwopz Huziqppx Udhhclcgt', 'content_short': 'mock data', 'content': '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>', 'forecast': 99.48, 'importance': 3, 'type': 'EU', 'status': 'draft', 'display_time': '1991-05-16 21:32:51', 'comment_disabled': true, 'pageviews': 3880, 'image_uri': 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3', 'platforms': ['a-platform'] }, { 'id': 6, 'timestamp': 986495063677, 'author': 'Robert', 'reviewer': 'Elizabeth', 'title': 'Ttbtxwkj Xbmtt Nizvopfuch Vqx Lzjbydvjz Qzwhxa Pdvwbjcri Zmjwsa', 'content_short': 'mock data', 'content': '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>', 'forecast': 90.48, 'importance': 3, 'type': 'JP', 'status': 'draft', 'display_time': '2013-01-04 03:31:40', 'comment_disabled': true, 'pageviews': 3532, 'image_uri': 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3', 'platforms': ['a-platform'] }, { 'id': 7, 'timestamp': 120241166849, 'author': 'Melissa', 'reviewer': 'Patricia', 'title': 'Ufdxyiu Ppuigb Dtum Wlkhmm Dxrr', 'content_short': 'mock data', 'content': '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>', 'forecast': 13.46, 'importance': 2, 'type': 'US', 'status': 'draft', 'display_time': '1986-11-21 20:42:04', 'comment_disabled': true, 'pageviews': 1875, 'image_uri': 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3', 'platforms': ['a-platform'] }, { 'id': 8, 'timestamp': 309825184295, 'author': 'Scott', 'reviewer': 'Cynthia', 'title': 'Ffyt Omiqfkpuep Bxsfbwpvk Mqveuvaaeo Fuxosrtmg Jyxs Bskknbtv Etq Qadlqo', 'content_short': 'mock data', 'content': '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>', 'forecast': 85.15, 'importance': 2, 'type': 'CN', 'status': 'draft', 'display_time': '1995-02-12 05:54:28', 'comment_disabled': true, 'pageviews': 2895, 'image_uri': 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3', 'platforms': ['a-platform'] }, { 'id': 9, 'timestamp': 369895239832, 'author': 'Sarah', 'reviewer': 'Deborah', 'title': 'Heh Ketgkoe Toysw Erihl Ubmknetsct Glmnx Cwivexgbeo Zwx Mvktnjh Nsuved', 'content_short': 'mock data', 'content': '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>', 'forecast': 46.85, 'importance': 1, 'type': 'CN', 'status': 'deleted', 'display_time': '2016-11-29 02:45:52', 'comment_disabled': true, 'pageviews': 722, 'image_uri': 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3', 'platforms': ['a-platform'] }, { 'id': 10, 'timestamp': 146567053616, 'author': 'Kenneth', 'reviewer': 'Ruth', 'title': 'Osrhnrf Kdggrei Twjkxdl Zqsh Xdujnuv Uhhweszph Mwqiqa Boarq Kfvgixln Mkbjc', 'content_short': 'mock data', 'content': '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>', 'forecast': 37.39, 'importance': 2, 'type': 'CN', 'status': 'published', 'display_time': '1984-12-26 11:23:56', 'comment_disabled': true, 'pageviews': 3521, 'image_uri': 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3', 'platforms': ['a-platform'] }, { 'id': 11, 'timestamp': 328236555073, 'author': 'Thomas', 'reviewer': 'Jason', 'title': 'Htjkvyv Rjmybzk Usrukwv Lvlgm Mmwywuqd Njep', 'content_short': 'mock data', 'content': '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>', 'forecast': 55.99, 'importance': 1, 'type': 'JP', 'status': 'published', 'display_time': '1980-10-24 23:46:06', 'comment_disabled': true, 'pageviews': 2164, 'image_uri': 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3', 'platforms': ['a-platform'] }, { 'id': 12, 'timestamp': 1560819737712, 'author': 'Ronald', 'reviewer': 'Kenneth', 'title': 'Eddgojx Jffrtrdrc Forktty Tpwacu Avk Mukrowj Tuliupr Upvtnhi Nzurz Xhklcwmnf', 'content_short': 'mock data', 'content': '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>', 'forecast': 93.03, 'importance': 2, 'type': 'US', 'status': 'draft', 'display_time': '1974-03-31 18:56:58', 'comment_disabled': true, 'pageviews': 628, 'image_uri': 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3', 'platforms': ['a-platform'] }, { 'id': 13, 'timestamp': 731360488179, 'author': 'Deborah', 'reviewer': 'Jeffrey', 'title': 'Hkpjs Eugyxruxi Rntp Elupxvyye Lhlitx Cmhodireo Ddyuurty Hfxujsk Keunxvhc Hcygtiyw', 'content_short': 'mock data', 'content': '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>', 'forecast': 26.68, 'importance': 2, 'type': 'JP', 'status': 'published', 'display_time': '2019-07-04 10:55:42', 'comment_disabled': true, 'pageviews': 2290, 'image_uri': 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3', 'platforms': ['a-platform'] }, { 'id': 14, 'timestamp': 1194472734635, 'author': 'Ronald', 'reviewer': 'Matthew', 'title': 'Xwgkt Xeslenjvwt Tltoqvn Peac Gorimbf', 'content_short': 'mock data', 'content': '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>', 'forecast': 6.89, 'importance': 2, 'type': 'CN', 'status': 'draft', 'display_time': '1971-01-23 03:41:47', 'comment_disabled': true, 'pageviews': 466, 'image_uri': 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3', 'platforms': ['a-platform'] }, { 'id': 15, 'timestamp': 460774495702, 'author': 'Jennifer', 'reviewer': 'Barbara', 'title': 'Tbhdlvwjdw Mreqcd Vcmy Uqsdkos Kcwruuu Dokv Xrelk Welymlvtkc', 'content_short': 'mock data', 'content': '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>', 'forecast': 67.67, 'importance': 2, 'type': 'CN', 'status': 'draft', 'display_time': '2007-11-25 12:50:41', 'comment_disabled': true, 'pageviews': 1701, 'image_uri': 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3', 'platforms': ['a-platform'] }, { 'id': 16, 'timestamp': 135889749410, 'author': 'Jose', 'reviewer': 'Charles', 'title': 'Jjuvq Dxwhnhnxf Fmkqxfcqlr Ektmnlkkuy Okxqwhf Sxhjscd', 'content_short': 'mock data', 'content': '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>', 'forecast': 20.57, 'importance': 3, 'type': 'EU', 'status': 'draft', 'display_time': '1981-02-12 06:04:37', 'comment_disabled': true, 'pageviews': 1547, 'image_uri': 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3', 'platforms': ['a-platform'] }, { 'id': 17, 'timestamp': 288426574654, 'author': 'Anna', 'reviewer': 'Patricia', 'title': 'Tsmlpog Pxq Zjpcxlat Grrutq Lbxwggw Sgoim Mig', 'content_short': 'mock data', 'content': '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>', 'forecast': 6.49, 'importance': 1, 'type': 'US', 'status': 'published', 'display_time': '1972-05-18 14:48:53', 'comment_disabled': true, 'pageviews': 3764, 'image_uri': 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3', 'platforms': ['a-platform'] }, { 'id': 18, 'timestamp': 668469587383, 'author': 'Shirley', 'reviewer': 'Charles', 'title': 'Nyuxxkuo Cpuld Arrtux Pkfv Kftnyxg Wijn Oeefjeufg Cyymygvrv Zxpxvwg Mnmwvhe', 'content_short': 'mock data', 'content': '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>', 'forecast': 30.16, 'importance': 1, 'type': 'JP', 'status': 'published', 'display_time': '1996-06-13 15:12:36', 'comment_disabled': true, 'pageviews': 3876, 'image_uri': 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3', 'platforms': ['a-platform'] }, { 'id': 19, 'timestamp': 1457727507351, 'author': 'Deborah', 'reviewer': 'Ruth', 'title': 'Szqrg Jqkuydwed Yxbv Ybixegm Sfkvjuq Rinviqv Biabmmdu Pueodgjd Dyh', 'content_short': 'mock data', 'content': '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>', 'forecast': 53.74, 'importance': 2, 'type': 'JP', 'status': 'published', 'display_time': '1975-05-13 02:16:34', 'comment_disabled': true, 'pageviews': 1247, 'image_uri': 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3', 'platforms': ['a-platform'] }, { 'id': 20, 'timestamp': 377688574823, 'author': 'Kevin', 'reviewer': 'Donald', 'title': 'Useakdl Mxmx Gucgisbj Deng Xsxmq Vrjlg', 'content_short': 'mock data', 'content': '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>', 'forecast': 33.82, 'importance': 1, 'type': 'EU', 'status': 'deleted', 'display_time': '1996-08-17 15:24:50', 'comment_disabled': true, 'pageviews': 1371, 'image_uri': 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3', 'platforms': ['a-platform'] }] }}
      this.list = response.data.items
      this.total = response.data.total
      this.listLoading = false
      // getList(this.listQuery).then(response => {
      //
      // })
    },
    topSearch() {
      this.searchObj = {}
      this.popoverVisible = false
      // this.$message({
      //   showClose: true,
      //   message: '恭喜你，这是一条成功消息',
      //   type: 'success'
      // })
    },
    handleNodeClick(data) {
      console.log(data)
    },
    add() {
      this.$router.push({ path: '/systemManage/menuManage/add' })
    },
    detail(id) {
      console.log(id)
    },
    del(id) {
      console.log(id)
    },
    edit(id) {
      console.log(id)
    }
  }
}
</script>

<style scoped>
  .left {
    float: left;
    width:300px;
    height: 100vh;
    margin-right: 10px;
    border:1px solid rgba(222, 222, 222, 1);
  }
  .right {
    width: calc(100% - 310px) !important;
    float: right;
  }
</style>
