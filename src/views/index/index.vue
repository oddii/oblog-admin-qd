<template>
  <div class="index-wrapper">
    <!--顶部区域-->
    <div class="top-wrapper clearfix">
      <!--左侧区域-->
      <div class="left-wrapper clearfix">
        <!--展示盒子区域-->
        <div class="box-container">
          <el-card class="box-item">
            <div class="item-icon" style="color: #a29bfe"><i class="iconfont">&#xe869;</i></div>
            <div class="item-title" >阅读</div>
            <div class="item-num" style="color: #a29bfe">{{views}}</div>
          </el-card>
          <el-card class="box-item">
            <div class="item-icon" style="color: #ff7675"><i class="iconfont">&#xe707;</i></div>
            <div class="item-title">点赞</div>
            <div class="item-num" style="color: #ff7675">{{likes}}</div>
          </el-card>
          <el-card class="box-item">
            <div class="item-icon" style="color: #00cec9"><i class="iconfont">&#xe85d;</i></div>
            <div class="item-title">博文</div>
            <div class="item-num" style="color: #00cec9">{{blog_num}}</div>
          </el-card>
          <el-card class="box-item">
            <div class="item-icon" style="color: #74b9ff"><i class="iconfont">&#xe704;</i></div>
            <div class="item-title">留言</div>
            <div class="item-num" style="color: #74b9ff">{{msg_num}}</div>
          </el-card>
        </div>

        <!--图表区域-->
        <el-card class="chart-container">
          <div class="container-title">过去七天情况统计</div>
          <ve-line :data="lineData" :settings="lineSettings" :colors="lineColors" :extend="lineExtend" :grid="lineGrid" height="300px"/>
        </el-card>
      </div>
      <!--右侧区域-->
      <div class="right-wrapper clearfix">
        <el-card class="right-container">
          <div class="container-title">最热博文</div>
          <div class="blog-container">
            <div class="blog-item" v-for="item in top5BlogList" :key="item.id">
              <div class="item-left">
                <img :src="item.firstPicture"/>
              </div>
              <div class="item-right">
                <div class="item-title">{{item.title}}</div>
                <div class="item-author">{{item.author}}</div>
                <div class="item-bottom">
                  <span class="item-date">{{item.gmtModified}}</span>
                  <div class="item-bottom-right">
                    <span class="item-views" >
                    <i class="iconfont" style="color: #6c5ce7">&#xe869;</i>
                    {{item.views}}
                  </span>
                    <span class="item-likes" >
                    <i class="iconfont" style="color: #ff7675">&#xe707;</i>
                    {{item.likes}}
                  </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <!--底部区域-->
    <div class="bottom-wrapper clearfix">
      <!--左侧区域-->
      <div class="left-wrapper">
        <el-card class="left-container">
          <div class="container-title">博文分类</div>
          <ve-ring :data="ringData" :settings="ringSettings" :extend="ringExtend" height="300px"/>
        </el-card>
      </div>

      <!--中部区域-->
      <div class="center-wrapper">
        <el-card class="center-container">
          <div class="center-item">
            <div class="container-title">最新评论</div>
            <div class="item-wrapper" v-for="item in latestCommentList" :key="item.id">
              <div class="item-left">
                <el-avatar :size="50" :src="item.avatar" icon="el-icon-user"/>
              </div>
              <div class="item-right">
                <div class="item-title">{{item.title}}</div>
                <div class="item-content">{{item.content}}</div>
                <div class="item-bottom">
                  <span class="item-nickname">{{item.nickname}}</span>
                  <span class="item-date">{{item.gmtModified}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="center-item">
            <div class="container-title">最新留言</div>
            <div class="item-wrapper" v-for="item in latestMessageList" :key="item.id">
              <div class="item-left">
                <el-avatar :size="50" :src="item.avatar" icon="el-icon-user"/>
              </div>
              <div class="item-right">
                <div class="item-content">{{item.content}}</div>
                <div class="item-bottom">
                  <span class="item-nickname">{{item.nickname}}</span>
                  <span class="item-date">{{item.gmtModified}}</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!--右侧区域-->
      <div class="right-wrapper">
        <!--天气区域-->
        <el-card class="right-item-container">
          <div id="he-plugin-standard"></div>
        </el-card>
        <!--信息区域-->
        <el-card class="right-item-container">
          <div class="container-title">最新公告</div>
          <!--公告区域-->
          <div class="anno-container">
            <el-timeline>
              <el-timeline-item v-for="(item,index) in latestAnnoList" :key="item.id" :color="AnnoListColors[index]"
                :timestamp="item.gmtModified">
                {{item.content}}
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import weatherUtils from '../../utils/weatherUtils'
import api from '../../api/baseApi'
import BLOG_API_URL from '../../api/blogApiUrl'
import MESSAGE_API_URL from '../../api/messageApiUrl'
import SETTING_API_URL from '../../api/setttingApiUrl'
import TYPE_API_URL from '../../api/typeApiUrl'
import COMMENT_API_URL from '../../api/commentApiUrl'
export default {
  name: 'index',
  created () {
    weatherUtils.weatherInit()
    this.getBoxInfo()
    this.getTop5BlogList()
    this.getLatestAnnoList()
    this.getTop10TypeList()
    this.getLatestCommentList()
    this.getLatestMessageList()
  },
  data () {
    return {
      views: 0,
      likes: 0,
      blog_num: 0,
      msg_num: 0,
      top5BlogList: [], //  最热博文
      latestAnnoList: [], //  最新公告
      latestCommentList: [], //  最新评论
      latestMessageList: [], //  最新留言
      AnnoListColors: ['#a29bfe', '#74b9ff'], //  最新公告时间线颜色
      lineColors: ['#a29bfe', '#ff7675', '#00cec9', '#74b9ff'],
      lineGrid: {
        show: true,
        backgroundColor: '#f6fafe',
        borderColor: '#f6fafe'
      },
      lineExtend: {
        yAxis: {
          name: '数量',
          axisLabel: {
            textStyle: {
              color: '#999',
              fontSize: 14
            }
          },
          splitLine: { show: false },
          position: 'left',
          axisLine: {
            show: true,
            lineStyle: { color: '#999' }
          }
        },
        xAxis: {
          splitLine: { show: false },
          axisLine: {
            show: true,
            lineStyle: { color: '#999' }
          }
        }
      },
      lineSettings: {
        xAxisType: 'category'
      },
      lineData: {
        columns: ['日期', '阅读', '点赞', '博文', '留言'],
        rows: []
      },
      ringSettings: {
        selectedMode: 'single',
        roseType: 'radius',
        offsetY: 110
      },
      ringExtend: {
        legend: {
          x: 'center',
          y: 'bottom'
        }
      },
      ringData: {
        columns: ['name', 'num'],
        rows: []
      }
    }
  },
  methods: {
    getBoxInfo () {
      /**
       * 获得四个盒子内展示信息
       */
      api.getObject(BLOG_API_URL.getViewsAndLikesAndNum, {})
        .then(result => {
          const { data } = result
          if (data.code !== 200) return this.$message.error('服务器出现错误，请稍后再试')

          this.views = data.data.views
          this.likes = data.data.likes
          this.blog_num = data.data.blog_num
        })
        .catch(error => {
          if (error.response) return this.$message.error('服务器出现错误，请稍后再试')
        })

      api.getObject(MESSAGE_API_URL.selectNum, {})
        .then(result => {
          const { data } = result
          if (data.code !== 200) return this.$message.error('服务器出现错误，请稍后再试')

          this.msg_num = data.data.msg_num
        })
        .catch(error => {
          if (error.response) return this.$message.error('服务器出现错误，请稍后再试')
        })
    },
    getTop5BlogList () {
      /**
       * 获得 top5 博文列表
       */
      api.getObject(BLOG_API_URL.getTop5BlogList, {})
        .then(result => {
          const { data } = result
          if (data.code !== 200) return this.$message.error('服务器出现错误，请稍后再试')

          this.top5BlogList = data.data
        })
        .catch(error => {
          if (error.response) return this.$message.error('服务器出现错误，请稍后再试')
        })
    },
    getLatestAnnoList () {
      /**
       * 获得最新公告
       */
      api.getObject(SETTING_API_URL.getLatestAnnoList, {})
        .then(result => {
          const { data } = result
          if (data.code !== 200) return this.$message.error('服务器出现错误，请稍后再试')

          this.latestAnnoList = data.data
        })
        .catch(error => {
          if (error.response) return this.$message.error('服务器出现错误，请稍后再试')
        })
    },
    getTop10TypeList () {
      /**
       * 获得 top10 分类并填充进 ring
       */

      api.getObject(TYPE_API_URL.getTop10TypeList, {})
        .then(result => {
          const { data } = result
          if (data.code !== 200) return this.$message.error('服务器出现错误，请稍后再试')

          data.data.forEach(item => {
            this.ringData.rows.push({
              name: item.name,
              num: item.num
            })
          })
        })
        .catch(error => {
          if (error.response) return this.$message.error('服务器出现错误，请稍后再试')
        })
    },
    getLatestCommentList () {
      /**
       * 获得最新评论
       */
      api.getObject(COMMENT_API_URL.getLatestCommentList, {})
        .then(result => {
          const { data } = result
          if (data.code !== 200) return this.$message.error('服务器出现错误，请稍后再试')

          this.latestCommentList = data.data
          console.log(this.latestCommentList)
        })
        .catch(error => {
          if (error.response) return this.$message.error('服务器出现错误，请稍后再试')
        })
    },
    getLatestMessageList () {
      /**
       * 获得最新留言
       */
      api.getObject(MESSAGE_API_URL.getLatestMessageList, {})
        .then(result => {
          const { data } = result
          if (data.code !== 200) return this.$message.error('服务器出现错误，请稍后再试')

          this.latestMessageList = data.data
        })
        .catch(error => {
          if (error.response) return this.$message.error('服务器出现错误，请稍后再试')
        })
    }
  }
}
</script>

<style lang="less" scoped>
.index-wrapper{
  height: 100%;
  padding: 1%;

  .el-card{
    border-radius: 13px;
  }

  .container-title{
    font-size: 17.6px;
    color: #636e72;
    font-weight: 500;
    margin-bottom: 20px;
  }

  .top-wrapper{
    height: 580px;
    display: flex;
    justify-content: center;
    margin-bottom: 2%;

    .left-wrapper,
    .right-wrapper{
      width: 50%;
    }

    .left-wrapper{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-right: 2.4%;

      .box-container{
        height: 32%;
        display: flex;
        justify-content: space-between;
        .box-item{
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          width: 21.7%;
          text-align: center;
          cursor: pointer;

          .item-icon{
            margin: 0 auto;
            width: 50px;
            height: 50px;
            text-align: center;
            line-height: 50px;

            i{
              font-size: 45px;
              transition: all .4s;
            }
          }

          .item-title{
            margin: 13px 0 8px 0;
            font-size: 15px;
            color: #636e72;
          }

          .item-num{
            font-size: 25px;
            color: #2d3436;
            transition: all .4s;
          }

          &:hover .item-icon i{
             font-size: 60px;
             margin-left: -10%;
           }

          &:hover .item-num{
            font-size: 27px;
          }
        }

      }

      .chart-container{
        height: 68%;
        margin-top: 4%;
      }
    }

    .right-wrapper{
      .right-container{
        height: 100%;

        .blog-container{
          height: 490px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .blog-item{
            height: 80px;
            display: flex;
            cursor: pointer;

            .item-left{
              width: 146.7px;
              margin-right: 15px;
              img{
                border-radius: 13px;
                width: 100%;
              }
            }

            .item-right{
              width:  520px;
              display: flex;
              flex-direction: column;
              justify-content: space-around;

              .item-title{
                margin-bottom: 6px;
                color: #636e72;
              }
              .item-author{
                font-size: 14px;
                color: #2d3436;
              }
              .item-bottom{
                display: flex;
                justify-content: space-between;
                font-size: 15px;
                color: #636e72;
                .item-bottom-right{
                  font-size: 16px;
                }
              }
            }
          }
        }
      }
    }
  }

  .bottom-wrapper{
    height: 380px;
    display: flex;
    justify-content: space-between;
    .left-wrapper{
      width: 30%;
      .left-container{
        height: 100%;
      }
    }

    .center-wrapper{
      width: 40%;
      margin:0 2.2%;
      .center-container{
        height: 100%;
        overflow-y: scroll;
        .item-wrapper{
          height: 60px;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          .item-right{
            width: 450px;
            margin-left: 10px;
            .item-title,
            .item-nickname,
            .item-date{
              font-size: 13px;
              color: #2d3436;
            }
            .item-content{
              font-size: 14px;
              margin: 3px 0 7px 0;
            }
            .item-bottom{
              display: flex;
              justify-content: space-between;
            }

          }
        }
      }
    }

    .right-wrapper{
      width: 30%;
      display: flex;
      flex-direction: column;

      .right-item-container{
        height: 50%;

        &:first-child{
          margin-bottom: 8%;
        }
      }
    }
  }

}

</style>
