---
title: MaterialDesign
date: 2021-03-23 13:20:04
tags:
---
#### Material UI System
System是Material UI 自定义主题、样式的一套方法
依赖
```
npm install @material-ui/system@next @emotion/react @emotion/styled
```
+ 直接就可以在你需要的组件上面进行样式定制
+ 避免定义一些列的样式（className）或带样式组件（styled-component）
+ 制定统一的标准 如字体 字号 色系

[关于使用sx系统样式与定义styled-component的书写差异](https://mui.com/zh/system/basics/#why-use-the-system)
styled-component
```
const StatHeader = styled('div')(z
  ({ theme }) => `
  color: blue;
`,
);

...
return (
  <StatHeader>font color is blue here</StatHeader>
)
```
‘轻’组件(Box, Stack, Typography, and Grid) 和 sx属性
```

return (
   <Box sx={{ color: 'text.secondary' }}>this color is blue here</Box>
)
```

#### Material Design
[Material Design](https://material.io/develop/web)

[Color Palette tool](http://mcg.mbitson.com/#!?csd2021=%2336b0c9&themename=mcgtheme)
一套以上述工具生成的颜色模板(基于#36b0c9)👇
```
$qqs-design:(
    50: #e7f6f9,
    100: #c3e7ef,
    200: #9bd8e4,
    300: #72c8d9,
    400: #54bcd1,
    500: #36b0c9,
    600: #30a9c3,
    700: #29a0bc,
    800: #2297b5,
    900: #1687a9,
    A100: #dcf6ff,
    A200: #a9e9ff,
    A400: #76ddff,
    A700: #5dd6ff,
    contrast: (
      50: #262626,
      100: #262626,
      200: #262626,
      300: white,
      400: white,
      500: white,
      600: white,
      A100: #262626,
      A200: white,
      A400: white,
      A700: white
    )
);
```
material套用自定义颜色模板
```
// Custom Theming for Angular Material
// For more information: https://material.angular.io/guide/theming
@import '~@angular/material/theming';
// Plus imports for other components in your app.
@import 'theme.scss';
// Include the common styles for Angular Material. We include this here so that you only
// have to load a single css file for Angular Material in your app.
// Be sure that you only ever include this mixin once!
@include mat-core();

// Define the palettes for your theme using the Material Design palettes available in palette.scss
// (imported above). For each palette, you can optionally specify a default, lighter, and darker
// hue. Available color palettes: https://material.io/design/color/
$CSDPartnerPortal-primary: mat-palette($csd2021);
$CSDPartnerPortal-accent: mat-palette($csd2021, 500, A100, A400);

// The warn palette is optional (defaults to red).
$CSDPartnerPortal-warn: mat-palette($mat-red);

// Create the theme object. A theme consists of configurations for individual
// theming systems such as "color" or "typography".
$CSDPartnerPortal-theme: mat-light-theme((
  color: (
    primary: $CSDPartnerPortal-primary,
    accent: $CSDPartnerPortal-accent,
    warn: $CSDPartnerPortal-warn,
  )
));

// Include theme styles for core and each component used in your app.
// Alternatively, you can import and @include the theme mixins for each component
// that you are using.
@include angular-material-theme($CSDPartnerPortal-theme);
```

#### 