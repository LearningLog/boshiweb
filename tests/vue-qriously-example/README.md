### vue-qriously 是基于 qrious 封装的一款二维码生成插件 [qrious 文档](https://github.com/neocotic/qrious/blob/master/README.md)

## 二维码容错级别
L级（低） 7％的码字可以被恢复。

M级（中） 的码字的15％可以被恢复。

Q级（四分）的码字的25％可以被恢复。

H级（高） 的码字的30％可以被恢复。

## API
<table style="text-align: center">
  <thead>
    <tr>
        <td>参数</td>
        <td>类型</td>
        <td>默认值</td>
        <td>可选值</td>
        <td>描述</td>
    </tr>
  </thead>
  <tbody>
    <tr>
        <td>background</td>
        <td>String</td>
        <td>"white"</td>
        <td></td>
        <td>二维码的背景颜色</td>
    </tr>
    <tr>
        <td>backgroundAlpha</td>
        <td>Number</td>
        <td>"1.0"</td>
        <td></td>
        <td>二维码的背景透明值</td>
    </tr>
    <tr>
        <td>foreground</td>
        <td>String</td>
        <td>"black"</td>
        <td></td>
        <td>二维码的前景颜色</td>
    </tr>
    <tr>
        <td>foregroundAlpha</td>
        <td>Number</td>
        <td>1.0</td>
        <td></td>
        <td>二维码的前景透明值</td>
    </tr>
    <tr>
        <td>level</td>
        <td>String</td>
        <td>"L"</td>
        <td>L, M, Q, H</td>
        <td>二维码的误差校正级别(L, M, Q, H)</td>
    </tr>
    <tr>
        <td>mime</td>
        <td>String</td>
        <td>"image/png"</td>
        <td></td>
        <td>二维码输出为图片时的MIME类型</td>
    </tr>
    <tr>
        <td>padding</td>
        <td>Number</td>
        <td>null (auto)</td>
        <td></td>
        <td>二维码的内边距</td>
    </tr>
    <tr>
        <td>size</td>
        <td>Number</td>
        <td>100</td>
        <td></td>
        <td>二维码的尺寸，单位像素</td>
    </tr>
    <tr>
        <td>value</td>
        <td>String</td>
        <td>*必填项</td>
        <td></td>
        <td>需要编码为二维码的值</td>
    </tr>
  </tbody>
</table>