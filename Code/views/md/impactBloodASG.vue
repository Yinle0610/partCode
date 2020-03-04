<template>
    <div class="blood-box">
        <el-card shadow="hover">
            <div slot="header" class="clearfix">
                <span style="font-weight:700">血统分析：</span><span style="font-weight:700">{{$route.params._title}}</span>
            </div>
            <svg-icon icon-class="blood" class="blood"></svg-icon>
        </el-card>
    </div>
</template>
<style lang="scss"  scoped>
.blood-box{
    height:calc(100vh - 92px);
    padding:12px;
    .el-card{
        height:100%;
        /deep/ .el-card__body{
            height:100%;
        }
        .blood{
            width:850px;
            height:700px;
            position: relative;
            left:50%;
            top:35%;
            transform: translate(-50%,-50%)

        }
    }
}
</style>