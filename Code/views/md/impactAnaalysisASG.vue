<template>
    <div class="anaalysis-box">
        <el-card shadow="hover">
            <div slot="header" class="clearfix">
                <span style="font-weight:700">影响分析：</span><span style="font-weight:700">{{$route.params._title}}</span>
            </div>
            <svg-icon icon-class="anaalysis" class="anaalysis"></svg-icon>
        </el-card>
    </div>
</template>
<style lang="scss"  scoped>
.anaalysis-box{
    height:calc(100vh - 92px);
    padding:12px;
    .el-card{
        height:100%;
        /deep/ .el-card__body{
            height:100%;
        }
        .anaalysis{
            width:300px;
            height:180px;
            position: relative;
            left:50%;
            top:35%;
            transform: translate(-50%,-50%)

        }
    }
}
</style>