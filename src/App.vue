<script>
	export default {
        globalData: {
            token: '',
            provider: '',
            openId: ''
        },
        onLaunch: function() {

			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
    @import './common/base.css';
    @import 'common/iconfont.css';

</style>
