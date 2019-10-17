<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      vnodes.push(<i class={ 'iconfont ' + icon}></i>)
    } else {
      vnodes.push(<i class={ 'iconfont withoutIcon' }></i>)
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>

<style>
	.withoutIcon {
		width: 16px;
		margin-right: 14px;
	}
</style>
