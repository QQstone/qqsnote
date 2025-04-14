---
title: 阿里系前端编码规范
date: 2023-08-17 14:36:29
tags:
- 编码规范
---
<div class="yuque-servicify-content">
    <div class="lake-engine-view lake-typography-traditional" tabindex="0"
        data-spm-anchor-id="a2c6h.12873639.article-detail.i3.2798425871fvAE">
        <p data-lake-id="a20d224c568e48b9d67847a2c66a8c01_p_0"><span data-card-type="inline" data-lake-card="image"
                contenteditable="false"
                data-card-value="data:%7B%22src%22%3A%22https%3A%2F%2Fucc.alicdn.com%2Fpic%2Fdeveloper-ecology%2Foou35l66wqkk2_29133ff1c9ea4273af6ad431e666c4bc.png%22%2C%22originWidth%22%3A897%2C%22originHeight%22%3A511%2C%22name%22%3A%22image.png%22%2C%22size%22%3A248610%2C%22display%22%3A%22inline%22%2C%22align%22%3A%22left%22%2C%22linkTarget%22%3A%22_blank%22%2C%22status%22%3A%22done%22%2C%22style%22%3A%22none%22%2C%22search%22%3A%22%22%2C%22margin%22%3A%7B%22top%22%3Atrue%2C%22bottom%22%3Atrue%7D%2C%22width%22%3A448.5%2C%22height%22%3A256%7D"
                class="lake-card-margin-top lake-card-margin-bottom"><span data-card-element="body"><span
                        data-card-element="center"><span class="lake-image">
                            <span class="lake-image-content lake-image-content-isvalid">
                                <span data-role="detail" class="lake-image-detail">
                                    <span class="lake-image-meta" style="">
                                        <img data-role="image"
                                            src="https://ucc.alicdn.com/pic/developer-ecology/oou35l66wqkk2_29133ff1c9ea4273af6ad431e666c4bc.png"
                                            data-raw-src="https://ucc.alicdn.com/pic/developer-ecology/oou35l66wqkk2_29133ff1c9ea4273af6ad431e666c4bc.png"
                                            class="image lake-drag-image" alt="image.png" title="image.png"
                                            style="visibility: visible; width: 448.5px; height: 256px;"  />
                                    </span>
                                </span>
                            </span>
                        </span></span></span></span></p>
        <p data-lake-id="05bdb1ebf5c256f42872c5ff07c62419"><br></p>
        <p data-lake-id="0b934dce63fe53868dc69363c4ea0d4c">前端规范体现在项目的
            <code>.prettierrc.js</code>、<code>.eslintrc.js</code>、<code>.stylelintrc.js</code>、<code>.editorconfig</code>
            文件中，项目的文件夹结构只要有项目模板或者最佳实践作为参考，都会按照已有的物料去组织逻辑去写业务代码。整体原则是减少需要主动去 review 和 check 的地方，尽量通过自动化解决大多数问题。</p>
        <p data-lake-id="6381bfd8ae43c4f184738783cddeebc1"><br></p>
        <h2 data-lake-id="94c2140ce4e92cdd7c9f3cddb4f9f68c" id="slide-0">一．编程规约</h2>
        <p data-lake-id="0b925d03eb397231dce3ef76719286a3"><br></p>
        <h3 data-lake-id="5c831251026254e15431074339c607f9" id="slide-1"
            data-spm-anchor-id="a2c6h.12873639.article-detail.i6.2798425871fvAE">(一) 命名规范</h3>
        <p data-lake-id="3c0aba434b2e0cf7ea0467d9dbd90582"><br></p>
        <h4 data-lake-id="a54c25bbba389a7d50a7d2257c1dd097" id="slide-2">项目命名</h4>
        <p data-lake-id="67f26d1b2e9be0f1792293442441143a"><br></p>
        <p data-lake-id="e0efe6e6aa53883ba6e7f2a92d1e29d5">全部采用小写方式，以中线分隔。</p>
        <div data-card-type="block" data-lake-card="codeblock" contenteditable="false"
            data-card-value="data:%7B%22mode%22%3A%22plain%22%2C%22code%22%3A%22%23%20%E6%AD%A3%E4%BE%8B%5Cndata-management-system%5Cn%23%20%E5%8F%8D%E4%BE%8B%5Cndata_management-system%2FdataManagementSystem%22%2C%22heightLimit%22%3Atrue%2C%22margin%22%3Atrue%2C%22id%22%3A%22UHEF4%22%7D"
            id="UHEF4" class="lake-card-margin">
            <div data-card-element="body">
                <div data-card-element="center">
                    <div class="lake-codeblock lake-codeblock-plain height-limit">
                        <div class="lake-codeblock-content">
                            <div class="CodeMirror CodeMirror-sizer">
                                <pre
                                    class="cm-s-default"><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content"># 正例
</span></span><span class="lake-preview-line" data-spm-anchor-id="a2c6h.12873639.article-detail.i5.2798425871fvAE"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">data-management-system
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content"># 反例
</span></span><span class="lake-preview-line" data-spm-anchor-id="a2c6h.12873639.article-detail.i1.2798425871fvAE"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">data_management-system/dataManagementSystem</span></span></pre>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lake-embed-toolbar lake-card-toolbar lake-embed-toolbar-block" contenteditable="false">
                    <div class="lake-embed-toolbar-group" data-aspm="card-toolbar"><span
                            class="lake-embed-toolbar-item lake-embed-toolbar-item-copyContent">
                            <a class="lake-embed-toolbar-btn " data-aspm-click="copyContent" data-aspm-param="unknown">
                                <span class="lake-icon lake-icon-copyContent"></span>
                            </a>
                        </span></div>
                </div>
            </div>
        </div>
        <h4 data-lake-id="aea5a34520303cdb34e7fb88271cd7c8" id="slide-3">目录命名</h4>
        <p data-lake-id="8abc523b1c233b556fec888628dcc5da"
            data-spm-anchor-id="a2c6h.12873639.article-detail.i8.2798425871fvAE">全部采用小写方式， 以中划线分隔，有复数结构时，要采用复数命名法，
            缩写不用复数。</p>
        <div data-card-type="block" data-lake-card="codeblock" contenteditable="false"
            data-card-value="data:%7B%22mode%22%3A%22plain%22%2C%22code%22%3A%22%23%20%E6%AD%A3%E4%BE%8B%5Cnsrc%2Fstyles%2Fcomponents%2Fimages%2Futils%2Flayouts%2Fdemo-styles%2F%5Cn%23%20%E5%8F%8D%E4%BE%8B%5Cnsrc%2Fstyles%2Fcomponents%2Fimages%2Futils%2Flayouts%2Fdemo_styles%2F%22%2C%22heightLimit%22%3Atrue%2C%22margin%22%3Atrue%2C%22id%22%3A%22hdBIg%22%7D"
            id="hdBIg" class="lake-card-margin">
            <div data-card-element="body">
                <div data-card-element="center">
                    <div class="lake-codeblock lake-codeblock-plain height-limit">
                        <div class="lake-codeblock-content">
                            <div class="CodeMirror CodeMirror-sizer">
                                <pre
                                    class="cm-s-default"><span class="lake-preview-line" data-spm-anchor-id="a2c6h.12873639.article-detail.i2.2798425871fvAE"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content"># 正例
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">src/styles/components/images/utils/layouts/demo-styles/
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content"># 反例
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">src/styles/components/images/utils/layouts/demo_styles/</span></span></pre>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lake-embed-toolbar lake-card-toolbar lake-embed-toolbar-block" contenteditable="false">
                    <div class="lake-embed-toolbar-group" data-aspm="card-toolbar"><span
                            class="lake-embed-toolbar-item lake-embed-toolbar-item-copyContent">
                            <a class="lake-embed-toolbar-btn " data-aspm-click="copyContent" data-aspm-param="unknown">
                                <span class="lake-icon lake-icon-copyContent"></span>
                            </a>
                        </span></div>
                </div>
            </div>
        </div>
        <p data-lake-id="8604a9503d4516e4d5b2367e6f320399"><br></p>
        <h4 data-lake-id="b2583378fb02937c5b4a70b224334c32" id="slide-4">JS、CSS、LESS、HTML、PNG 文件命名:</h4>
        <p data-lake-id="0a2799812587e9b36adec68d6070d84b">全部采用小写方式， 以中划线分隔。</p>
        <p data-lake-id="5e9f70b857880a7fd3dbc32e9c905094"><br></p>
        <div data-card-type="block" data-lake-card="codeblock" contenteditable="false"
            data-card-value="data:%7B%22mode%22%3A%22plain%22%2C%22code%22%3A%22%23%20%E6%AD%A3%E4%BE%8B%5Cnrender-dom.js%2Freset.css%2Fcompany.png%5Cn%23%20%E5%8F%8D%E4%BE%8B%5CnrenderDom.js%2FUserManager.html%22%2C%22heightLimit%22%3Atrue%2C%22margin%22%3Atrue%2C%22id%22%3A%22WLU95%22%7D"
            id="WLU95" class="lake-card-margin">
            <div data-card-element="body">
                <div data-card-element="center">
                    <div class="lake-codeblock lake-codeblock-plain height-limit">
                        <div class="lake-codeblock-content">
                            <div class="CodeMirror CodeMirror-sizer">
                                <pre
                                    class="cm-s-default"><span class="lake-preview-line" data-spm-anchor-id="a2c6h.12873639.article-detail.i4.2798425871fvAE"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content"># 正例
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">render-dom.js/reset.css/company.png
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content"># 反例
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">renderDom.js/UserManager.html</span></span></pre>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lake-embed-toolbar lake-card-toolbar lake-embed-toolbar-block" contenteditable="false">
                    <div class="lake-embed-toolbar-group" data-aspm="card-toolbar"><span
                            class="lake-embed-toolbar-item lake-embed-toolbar-item-copyContent">
                            <a class="lake-embed-toolbar-btn " data-aspm-click="copyContent" data-aspm-param="unknown">
                                <span class="lake-icon lake-icon-copyContent"></span>
                            </a>
                        </span></div>
                </div>
            </div>
        </div>
        <h3 data-lake-id="b1a377e94435b177c06d3fefeab7fe28" id="slide-5">(二) HTML 规范 （Vue Template 同样适用）</h3>
        <p data-lake-id="0e9b3f036743dbfbbae5be687fa6d81b"><br></p>
        <p data-lake-id="af69edeb04bd1a6979a1bcc5a49b8d68">缩进：缩进使用 2 个空格（一个 tab）；嵌套的节点应该缩进。 引号：使用双引号(" ") 而不是单引号(’ ') 。
        </p>
        <div data-card-type="block" data-lake-card="codeblock" contenteditable="false"
            data-card-value="data:%7B%22mode%22%3A%22plain%22%2C%22code%22%3A%22%3C!--%20%E6%AD%A3%E4%BE%8B%20--%3E%5Cn%3Cdiv%20class%3D%5C%22box%5C%22%3E%3C%2Fdiv%3E%5Cn%3C!--%20%E5%8F%8D%E4%BE%8B%20--%3E%5Cn%3Cdiv%20class%3D'box'%3E%3C%2Fdiv%3E%22%2C%22heightLimit%22%3Atrue%2C%22margin%22%3Atrue%2C%22id%22%3A%22lkkDJ%22%7D"
            id="lkkDJ" class="lake-card-margin">
            <div data-card-element="body">
                <div data-card-element="center">
                    <div class="lake-codeblock lake-codeblock-plain height-limit">
                        <div class="lake-codeblock-content">
                            <div class="CodeMirror CodeMirror-sizer">
                                <pre
                                    class="cm-s-default"><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">&lt;!-- 正例 --&gt;
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">&lt;div class="box"&gt;&lt;/div&gt;
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">&lt;!-- 反例 --&gt;
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">&lt;div class='box'&gt;&lt;/div&gt;</span></span></pre>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lake-embed-toolbar lake-card-toolbar lake-embed-toolbar-block" contenteditable="false">
                    <div class="lake-embed-toolbar-group" data-aspm="card-toolbar"><span
                            class="lake-embed-toolbar-item lake-embed-toolbar-item-copyContent">
                            <a class="lake-embed-toolbar-btn " data-aspm-click="copyContent" data-aspm-param="unknown">
                                <span class="lake-icon lake-icon-copyContent"></span>
                            </a>
                        </span></div>
                </div>
            </div>
        </div>
        <p data-lake-id="f8e4eda4521ad0deac132db1c8aadda6"><br></p>
        <h3 data-lake-id="975db50b765d8aa1adba28ff6398cb2c" id="slide-6">(三) CSS/LESS 规范</h3>
        <p data-lake-id="33c7b86404112bd5b3399e3cc1bad949"><br></p>
        <h4 data-lake-id="a24ad0a573136b1abae8a011a49313df" id="slide-7">命名</h4>
        <p data-lake-id="274f722f737fa360170e695fa2d90f0e"><br></p>
        <p data-lake-id="ce2048ecfdaeb2e828d480b9fd260495">类名使用小写、id用驼峰、变量用驼峰。名称反映元素目的和用途。</p>
        <div data-card-type="block" data-lake-card="codeblock" contenteditable="false"
            data-card-value="data:%7B%22mode%22%3A%22plain%22%2C%22code%22%3A%22%2F%2F%20%E6%AD%A3%E4%BE%8B%5Cn.heavy%20%7B%5Cn%20%20font-weight%3A%20800%3B%5Cn%7D%5Cn.important%20%7B%20%5Cn%20%20color%3A%20red%3B%20%5Cn%7D%5Cn%5Cn%2F%2F%20%E5%8F%8D%E4%BE%8B%5Cn.fw-800%20%7B%5Cn%20%20font-weight%3A%20800%3B%5Cn%7D%5Cn.red%20%7B%5Cn%20%20color%3A%20red%3B%20%5Cn%7D%22%2C%22heightLimit%22%3Atrue%2C%22margin%22%3Atrue%2C%22id%22%3A%22pXpHl%22%7D"
            id="pXpHl" class="lake-card-margin">
            <div data-card-element="body">
                <div data-card-element="center">
                    <div class="lake-codeblock lake-codeblock-plain height-limit">
                        <div class="lake-codeblock-content">
                            <div class="CodeMirror CodeMirror-sizer">
                                <pre
                                    class="cm-s-default"><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">// 正例
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">.heavy {
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">  font-weight: 800;
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">}
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">.important { 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">  color: red; 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">}
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">// 反例
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">.fw-800 {
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">  font-weight: 800;
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">}
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">.red {
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">  color: red; 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">}</span></span></pre>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lake-embed-toolbar lake-card-toolbar lake-embed-toolbar-block" contenteditable="false">
                    <div class="lake-embed-toolbar-group" data-aspm="card-toolbar"><span
                            class="lake-embed-toolbar-item lake-embed-toolbar-item-copyContent">
                            <a class="lake-embed-toolbar-btn " data-aspm-click="copyContent" data-aspm-param="unknown">
                                <span class="lake-icon lake-icon-copyContent"></span>
                            </a>
                        </span></div>
                </div>
            </div>
        </div>
        <p data-lake-id="49df3ed22679f26cac51efbc93206ced"><br></p>
        <h4 data-lake-id="500e0e70e4da989ef5dbf66dc4bfd4f2" id="slide-8">选择器</h4>
        <p data-lake-id="7754a4ad261d601f66de2f6d49fe8e24">避免使用标签名、使用直接子选择器</p>
        <div data-card-type="block" data-lake-card="codeblock" contenteditable="false"
            data-card-value="data:%7B%22mode%22%3A%22plain%22%2C%22code%22%3A%22%2F%2F%20%E6%AD%A3%E4%BE%8B%5Cn.content%20%3E%20.title%20%7B%5Cn%20%20%20font-size%3A%202rem%3B%5Cn%20%7D%5Cn%5Cn%2F%2F%20%E5%8F%8D%E4%BE%8B%5Cn.content%20.title%20%7B%5Cn%20%20font-size%3A%202rem%3B%5Cn%7D%5Cn%22%2C%22heightLimit%22%3Atrue%2C%22margin%22%3Atrue%2C%22id%22%3A%22fxVu8%22%7D"
            id="fxVu8" class="lake-card-margin">
            <div data-card-element="body">
                <div data-card-element="center">
                    <div class="lake-codeblock lake-codeblock-plain height-limit">
                        <div class="lake-codeblock-content">
                            <div class="CodeMirror CodeMirror-sizer">
                                <pre class="cm-s-default"><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">// 正例
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">.content &gt; .title {
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">   font-size: 2rem;
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content"> }
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">// 反例
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">.content .title {
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">  font-size: 2rem;
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">}
</span></span></pre>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lake-embed-toolbar lake-card-toolbar lake-embed-toolbar-block" contenteditable="false">
                    <div class="lake-embed-toolbar-group" data-aspm="card-toolbar"><span
                            class="lake-embed-toolbar-item lake-embed-toolbar-item-copyContent">
                            <a class="lake-embed-toolbar-btn " data-aspm-click="copyContent" data-aspm-param="unknown">
                                <span class="lake-icon lake-icon-copyContent"></span>
                            </a>
                        </span></div>
                </div>
            </div>
        </div>
        <h4 data-lake-id="9b7e926976fb705fe78ceae8eb52f1cf" id="slide-9">省略 0 后面的单位</h4>
        <p data-lake-id="b734945d594c868d06b3a543b555e7a0"><br></p>
        <div data-card-type="block" data-lake-card="codeblock" contenteditable="false"
            data-card-value="data:%7B%22mode%22%3A%22plain%22%2C%22code%22%3A%22%2F%2F%20%E6%AD%A3%E4%BE%8B%5Cndiv%20%7B%5Cn%20%20padding-bottom%3A%200%3B%20%5Cn%20%20margin%3A%200%3B%20%5Cn%7D%5Cn%2F%2F%20%E5%8F%8D%E4%BE%8B%5Cndiv%20%7B%5Cn%20%20padding-bottom%3A%200px%3B%20%5Cn%20%20margin%3A%200em%3B%5Cn%7D%5Cn%22%2C%22heightLimit%22%3Atrue%2C%22margin%22%3Atrue%2C%22id%22%3A%22bdP0X%22%7D"
            id="bdP0X" class="lake-card-margin">
            <div data-card-element="body">
                <div data-card-element="center">
                    <div class="lake-codeblock lake-codeblock-plain height-limit">
                        <div class="lake-codeblock-content">
                            <div class="CodeMirror CodeMirror-sizer">
                                <pre class="cm-s-default"><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">// 正例
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">div {
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">  padding-bottom: 0; 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">  margin: 0; 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">}
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">// 反例
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">div {
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">  padding-bottom: 0px; 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">  margin: 0em;
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">}
</span></span></pre>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lake-embed-toolbar lake-card-toolbar lake-embed-toolbar-block" contenteditable="false">
                    <div class="lake-embed-toolbar-group" data-aspm="card-toolbar"><span
                            class="lake-embed-toolbar-item lake-embed-toolbar-item-copyContent">
                            <a class="lake-embed-toolbar-btn " data-aspm-click="copyContent" data-aspm-param="unknown">
                                <span class="lake-icon lake-icon-copyContent"></span>
                            </a>
                        </span></div>
                </div>
            </div>
        </div>
        <p data-lake-id="bdb15879c062d04eceabc3d7e088fc62"><br></p>
        <h4 data-lake-id="e572462b1d961001030f0e93be8538a6" id="slide-10">代码组织</h4>
        <p data-lake-id="52b1ec0f9a34a071c18d3d57d6588b28">将公共 less 文件放置在 <code>style/less/common</code>
            文件夹，<code>color.less</code>，<code>common.less</code>。按以下顺序组织</p>
        <div data-card-type="block" data-lake-card="codeblock" contenteditable="false"
            data-card-value="data:%7B%22mode%22%3A%22plain%22%2C%22code%22%3A%22%40import%20%5C%22mixins%2Fsize.less%5C%22%3B%20%5Cn%5Cn%40default-text-color%3A%20%23333%3B%20%5Cn%5Cn.page%20%7B%5Cn%20%20width%3A%20960px%3B%20%5Cn%20%20margin%3A%200%20auto%3B%20%5Cn%7D%5Cn%22%2C%22heightLimit%22%3Atrue%2C%22margin%22%3Atrue%2C%22id%22%3A%220v3x1%22%7D"
            id="0v3x1" class="lake-card-margin">
            <div data-card-element="body">
                <div data-card-element="center">
                    <div class="lake-codeblock lake-codeblock-plain height-limit">
                        <div class="lake-codeblock-content">
                            <div class="CodeMirror CodeMirror-sizer">
                                <pre class="cm-s-default"><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">@import "mixins/size.less"; 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">@default-text-color: #333; 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">.page {
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">  width: 960px; 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">  margin: 0 auto; 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">}
</span></span></pre>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lake-embed-toolbar lake-card-toolbar lake-embed-toolbar-block" contenteditable="false">
                    <div class="lake-embed-toolbar-group" data-aspm="card-toolbar"><span
                            class="lake-embed-toolbar-item lake-embed-toolbar-item-copyContent">
                            <a class="lake-embed-toolbar-btn " data-aspm-click="copyContent" data-aspm-param="unknown">
                                <span class="lake-icon lake-icon-copyContent"></span>
                            </a>
                        </span></div>
                </div>
            </div>
        </div>
        <h4 data-lake-id="9404c148f20bd9075b36ff70c1cb5b03" id="slide-11">避免嵌套层级过多:</h4>
        <p data-lake-id="9dfeefebd1df670f5a99bb664153defe"><br></p>
        <p data-lake-id="2c395b54d4daae92347babfaad133ba3">嵌套深度限制在 3 层。</p>
        <p data-lake-id="5866aeab354de7aa34ad2ee5f96da9eb"><br></p>
        <h3 data-lake-id="062fc73d0a0fadd0a67e12318933722c" id="slide-12">(四) Javascript 规范</h3>
        <div data-card-type="block" data-lake-card="codeblock" contenteditable="false"
            data-card-value="data:%7B%22mode%22%3A%22plain%22%2C%22code%22%3A%22%2F%2F%20%E6%96%B9%E6%B3%95%E5%90%8D%E3%80%81%E5%8F%82%E6%95%B0%E5%90%8D%E3%80%81%E6%88%90%E5%91%98%E5%8F%98%E9%87%8F%E3%80%81%E5%B1%80%E9%83%A8%E5%8F%98%E9%87%8F%E9%83%BD%E7%BB%9F%E4%B8%80%E4%BD%BF%E7%94%A8%E5%B0%8F%E9%A9%BC%E5%B3%B0%20lowerCamelCase%20%E9%A3%8E%E6%A0%BC%5Cnfunction%20getHttpMessage(inputUserId)%20%7B%5Cn%20%20let%20localValue%20%3D%20inputUserId%3B%5Cn%20%20return%20false%5Cn%7D%5Cn%5Cn%2F%2F%20%E5%B8%B8%E9%87%8F%E5%91%BD%E5%90%8D%E5%85%A8%E9%83%A8%E5%A4%A7%E5%86%99%EF%BC%8C%E5%8D%95%E8%AF%8D%E9%97%B4%E7%94%A8%E4%B8%8B%E5%88%92%E7%BA%BF%E9%9A%94%E5%BC%80%EF%BC%8C%E5%8A%9B%E6%B1%82%E8%AF%AD%E4%B9%89%E8%A1%A8%E8%BE%BE%E5%AE%8C%E6%95%B4%E6%B8%85%E6%A5%9A%EF%BC%8C%20%E4%B8%8D%E8%A6%81%E5%AB%8C%E5%90%8D%E5%AD%97%E9%95%BF%5Cnconst%20MAX_STOCK_COUNT%20%3D%200%3B%5Cn%5Cn%2F%2F%20this%20%E7%9A%84%E8%BD%AC%E6%8D%A2%E5%91%BD%E5%90%8D%5Cnconst%20_this%20%3D%20this%3B%22%2C%22heightLimit%22%3Atrue%2C%22margin%22%3Atrue%2C%22id%22%3A%22Xza2j%22%7D"
            id="Xza2j" class="lake-card-margin">
            <div data-card-element="body">
                <div data-card-element="center">
                    <div class="lake-codeblock lake-codeblock-plain height-limit">
                        <div class="lake-codeblock-content">
                            <div class="CodeMirror CodeMirror-sizer">
                                <pre
                                    class="cm-s-default"><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">// 方法名、参数名、成员变量、局部变量都统一使用小驼峰 lowerCamelCase 风格
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">function getHttpMessage(inputUserId) {
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">  let localValue = inputUserId;
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">  return false
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">}
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">// 常量命名全部大写，单词间用下划线隔开，力求语义表达完整清楚， 不要嫌名字长
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">const MAX_STOCK_COUNT = 0;
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">// this 的转换命名
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">const _this = this;</span></span></pre>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lake-embed-toolbar lake-card-toolbar lake-embed-toolbar-block" contenteditable="false">
                    <div class="lake-embed-toolbar-group" data-aspm="card-toolbar"><span
                            class="lake-embed-toolbar-item lake-embed-toolbar-item-copyContent">
                            <a class="lake-embed-toolbar-btn " data-aspm-click="copyContent" data-aspm-param="unknown">
                                <span class="lake-icon lake-icon-copyContent"></span>
                            </a>
                        </span></div>
                </div>
            </div>
        </div>
        <h4 data-lake-id="32fd7e61224409804e1bb50264009ff1" id="slide-13">JS 书写保持原则</h4>
        <ol data-lake-id="0fa18f6c8d80d71e0025ee1da636737c">
            <li data-lake-id="86e198dc299f402a6c1c3f35cca1cad3" style="padding-left: 6px;">提炼函数</li>
            <li data-lake-id="4cd2b78d34044e17a29843808559ce93" style="padding-left: 6px;">合并重复的条件片段</li>
            <li data-lake-id="60b78375f4ae557c94ffd049577f7a4e" style="padding-left: 6px;">把条件分支语句提炼成函数</li>
            <li data-lake-id="54ae4e6e793c31cd15a6a83ee2442cdf" style="padding-left: 6px;">少用三目运算符</li>
            <li data-lake-id="edea840a06e1181c0e23f7316e85cd0d" style="padding-left: 6px;">合理使用循环</li>
            <li data-lake-id="51c38f2c29f6bf034e3945a89a4132bb" style="padding-left: 6px;">提前让函数退出代替嵌套条件分支；用return退出多重循环
            </li>
            <li data-lake-id="23f2a9d6a016494abc13ca0c15ad9568" style="padding-left: 6px;">传递对象参数代替过长的参数列表，尽量减少参数数量</li>
        </ol>
        <div data-card-type="block" data-lake-card="codeblock" contenteditable="false"
            data-card-value="data:%7B%22mode%22%3A%22plain%22%2C%22code%22%3A%22const%20fn%20%3D%20(name%2C%20age)%20%3D%3E%20%7B%5Cn%20%20console.log('name%3D'%20%2B%20name)%3B%5Cn%20%20console.log('age%3D'%20%2B%20age)%3B%5Cn%7D%5Cn%5Cn%2F%2F%20%E4%BC%98%E5%8C%96%E4%B9%8B%E5%90%8E%5Cn%5Cnconst%20fn%20%3D%20(%20obj%20)%20%3D%3E%20%7B%5Cn%20%20console.log('name%3D'%20%2B%20obj.name)%3B%5Cn%20%20console.log('age%3D'%20%2B%20obj.age)%3B%5Cn%7D%5Cn%22%2C%22heightLimit%22%3Atrue%2C%22margin%22%3Atrue%2C%22id%22%3A%22pHYQg%22%7D"
            id="pHYQg" class="lake-card-margin">
            <div data-card-element="body">
                <div data-card-element="center">
                    <div class="lake-codeblock lake-codeblock-plain height-limit">
                        <div class="lake-codeblock-content">
                            <div class="CodeMirror CodeMirror-sizer">
                                <pre class="cm-s-default"><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">const fn = (name, age) =&gt; {
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">  console.log('name=' + name);
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">  console.log('age=' + age);
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">}
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">// 优化之后
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">const fn = ( obj ) =&gt; {
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">  console.log('name=' + obj.name);
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">  console.log('age=' + obj.age);
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">}
</span></span></pre>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lake-embed-toolbar lake-card-toolbar lake-embed-toolbar-block" contenteditable="false">
                    <div class="lake-embed-toolbar-group" data-aspm="card-toolbar"><span
                            class="lake-embed-toolbar-item lake-embed-toolbar-item-copyContent">
                            <a class="lake-embed-toolbar-btn " data-aspm-click="copyContent" data-aspm-param="unknown">
                                <span class="lake-icon lake-icon-copyContent"></span>
                            </a>
                        </span></div>
                </div>
            </div>
        </div>
        <h4 data-lake-id="0a4d816c99ff3e9123f17792e2007bdb" id="slide-14">方法命名必须是 动词 或者 动词+名词 形式</h4>
        <p data-lake-id="34a70ecb896089abd7175bdd64f54f3d"><br></p>
        <p data-lake-id="20c6d90cd5f8b40bb150f2a40e66e8d1">正例： saveShopCarData /openShopCarInfoDialog 反例： save / open /
            show / go 增删查改，详情统一使用如下 5 个单词，不得使用其他（目的是为了统一各个端）</p>
        <div data-card-type="block" data-lake-card="codeblock" contenteditable="false"
            data-card-value="data:%7B%22mode%22%3A%22plain%22%2C%22code%22%3A%22add%20%2F%20update%20%2F%20delete%20%2F%20detail%20%2F%20get%20%5Cn%E9%99%84%EF%BC%9A%20%E5%87%BD%E6%95%B0%E6%96%B9%E6%B3%95%E5%B8%B8%E7%94%A8%E7%9A%84%E5%8A%A8%E8%AF%8D%3A%20%5Cnget%20%E8%8E%B7%E5%8F%96%2Fset%20%E8%AE%BE%E7%BD%AE%2C%20%5Cnadd%20%E5%A2%9E%E5%8A%A0%2Fremove%20%E5%88%A0%E9%99%A4%2C%20%5Cncreate%20%E5%88%9B%E5%BB%BA%2Fdestroy%20%E9%94%80%E6%AF%81%2C%20%5Cnstart%20%E5%90%AF%E5%8A%A8%2Fstop%20%E5%81%9C%E6%AD%A2%2C%20%5Cnopen%20%E6%89%93%E5%BC%80%2Fclose%20%E5%85%B3%E9%97%AD%2C%20%5Cnread%20%E8%AF%BB%E5%8F%96%2Fwrite%20%E5%86%99%E5%85%A5%2C%20%5Cnload%20%E8%BD%BD%E5%85%A5%2Fsave%20%E4%BF%9D%E5%AD%98%2C%5Cnbegin%20%E5%BC%80%E5%A7%8B%2Fend%20%E7%BB%93%E6%9D%9F%2C%20%5Cnbackup%20%E5%A4%87%E4%BB%BD%2Frestore%20%E6%81%A2%E5%A4%8D%2C%5Cnimport%20%E5%AF%BC%E5%85%A5%2Fexport%20%E5%AF%BC%E5%87%BA%2C%20%5Cnsplit%20%E5%88%86%E5%89%B2%2Fmerge%20%E5%90%88%E5%B9%B6%2C%5Cninject%20%E6%B3%A8%E5%85%A5%2Fextract%20%E6%8F%90%E5%8F%96%2C%5Cnattach%20%E9%99%84%E7%9D%80%2Fdetach%20%E8%84%B1%E7%A6%BB%2C%20%5Cnbind%20%E7%BB%91%E5%AE%9A%2Fseparate%20%E5%88%86%E7%A6%BB%2C%20%5Cnview%20%E6%9F%A5%E7%9C%8B%2Fbrowse%20%E6%B5%8F%E8%A7%88%2C%20%5Cnedit%20%E7%BC%96%E8%BE%91%2Fmodify%20%E4%BF%AE%E6%94%B9%2C%5Cnselect%20%E9%80%89%E5%8F%96%2Fmark%20%E6%A0%87%E8%AE%B0%2C%20%5Cncopy%20%E5%A4%8D%E5%88%B6%2Fpaste%20%E7%B2%98%E8%B4%B4%2C%5Cnundo%20%E6%92%A4%E9%94%80%2Fredo%20%E9%87%8D%E5%81%9A%2C%20%5Cninsert%20%E6%8F%92%E5%85%A5%2Fdelete%20%E7%A7%BB%E9%99%A4%2C%5Cnadd%20%E5%8A%A0%E5%85%A5%2Fappend%20%E6%B7%BB%E5%8A%A0%2C%20%5Cnclean%20%E6%B8%85%E7%90%86%2Fclear%20%E6%B8%85%E9%99%A4%2C%5Cnindex%20%E7%B4%A2%E5%BC%95%2Fsort%20%E6%8E%92%E5%BA%8F%2C%5Cnfind%20%E6%9F%A5%E6%89%BE%2Fsearch%20%E6%90%9C%E7%B4%A2%2C%20%5Cnincrease%20%E5%A2%9E%E5%8A%A0%2Fdecrease%20%E5%87%8F%E5%B0%91%2C%20%5Cnplay%20%E6%92%AD%E6%94%BE%2Fpause%20%E6%9A%82%E5%81%9C%2C%20%5Cnlaunch%20%E5%90%AF%E5%8A%A8%2Frun%20%E8%BF%90%E8%A1%8C%2C%20%5Cncompile%20%E7%BC%96%E8%AF%91%2Fexecute%20%E6%89%A7%E8%A1%8C%2C%20%5Cndebug%20%E8%B0%83%E8%AF%95%2Ftrace%20%E8%B7%9F%E8%B8%AA%2C%20%5Cnobserve%20%E8%A7%82%E5%AF%9F%2Flisten%20%E7%9B%91%E5%90%AC%2C%5Cnbuild%20%E6%9E%84%E5%BB%BA%2Fpublish%20%E5%8F%91%E5%B8%83%2C%5Cninput%20%E8%BE%93%E5%85%A5%2Foutput%20%E8%BE%93%E5%87%BA%2C%5Cnencode%20%E7%BC%96%E7%A0%81%2Fdecode%20%E8%A7%A3%E7%A0%81%2C%20%5Cnencrypt%20%E5%8A%A0%E5%AF%86%2Fdecrypt%20%E8%A7%A3%E5%AF%86%2C%20%5Cncompress%20%E5%8E%8B%E7%BC%A9%2Fdecompress%20%E8%A7%A3%E5%8E%8B%E7%BC%A9%2C%20%5Cnpack%20%E6%89%93%E5%8C%85%2Funpack%20%E8%A7%A3%E5%8C%85%2C%5Cnparse%20%E8%A7%A3%E6%9E%90%2Femit%20%E7%94%9F%E6%88%90%2C%5Cnconnect%20%E8%BF%9E%E6%8E%A5%2Fdisconnect%20%E6%96%AD%E5%BC%80%2C%5Cnsend%20%E5%8F%91%E9%80%81%2Freceive%20%E6%8E%A5%E6%94%B6%2C%20%5Cndownload%20%E4%B8%8B%E8%BD%BD%2Fupload%20%E4%B8%8A%E4%BC%A0%2C%20%5Cnrefresh%20%E5%88%B7%E6%96%B0%2Fsynchronize%20%E5%90%8C%E6%AD%A5%2C%5Cnupdate%20%E6%9B%B4%E6%96%B0%2Frevert%20%E5%A4%8D%E5%8E%9F%2C%20%5Cnlock%20%E9%94%81%E5%AE%9A%2Funlock%20%E8%A7%A3%E9%94%81%2C%20%5Cncheck%20out%20%E7%AD%BE%E5%87%BA%2Fcheck%20in%20%E7%AD%BE%E5%85%A5%2C%20%5Cnsubmit%20%E6%8F%90%E4%BA%A4%2Fcommit%20%E4%BA%A4%E4%BB%98%2C%20%5Cnpush%20%E6%8E%A8%2Fpull%20%E6%8B%89%2C%5Cnexpand%20%E5%B1%95%E5%BC%80%2Fcollapse%20%E6%8A%98%E5%8F%A0%2C%20%5Cnenter%20%E8%BF%9B%E5%85%A5%2Fexit%20%E9%80%80%E5%87%BA%2C%5Cnabort%20%E6%94%BE%E5%BC%83%2Fquit%20%E7%A6%BB%E5%BC%80%2C%20%5Cnobsolete%20%E5%BA%9F%E5%BC%83%2Fdepreciate%20%E5%BA%9F%E6%97%A7%2C%20%5Cncollect%20%E6%94%B6%E9%9B%86%2Faggregate%20%E8%81%9A%E9%9B%86%5Cn%22%2C%22heightLimit%22%3Atrue%2C%22margin%22%3Atrue%2C%22id%22%3A%22e6PZn%22%7D"
            id="e6PZn" class="lake-card-margin">
            <div data-card-element="body">
                <div data-card-element="center">
                    <div class="lake-codeblock lake-codeblock-plain height-limit">
                        <div class="lake-codeblock-content">
                            <div class="CodeMirror CodeMirror-sizer">
                                <pre class="cm-s-default"><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">add / update / delete / detail / get 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">附： 函数方法常用的动词: 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">get 获取/set 设置, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">add 增加/remove 删除, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">create 创建/destroy 销毁, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">start 启动/stop 停止, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">open 打开/close 关闭, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">read 读取/write 写入, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">load 载入/save 保存,
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">begin 开始/end 结束, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">backup 备份/restore 恢复,
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">import 导入/export 导出, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">split 分割/merge 合并,
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">inject 注入/extract 提取,
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">attach 附着/detach 脱离, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">bind 绑定/separate 分离, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">view 查看/browse 浏览, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">edit 编辑/modify 修改,
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">select 选取/mark 标记, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">copy 复制/paste 粘贴,
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">undo 撤销/redo 重做, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">insert 插入/delete 移除,
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">add 加入/append 添加, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">clean 清理/clear 清除,
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">index 索引/sort 排序,
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">find 查找/search 搜索, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">increase 增加/decrease 减少, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">play 播放/pause 暂停, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">launch 启动/run 运行, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">compile 编译/execute 执行, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">debug 调试/trace 跟踪, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">observe 观察/listen 监听,
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">build 构建/publish 发布,
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">input 输入/output 输出,
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">encode 编码/decode 解码, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">encrypt 加密/decrypt 解密, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">compress 压缩/decompress 解压缩, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">pack 打包/unpack 解包,
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">parse 解析/emit 生成,
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">connect 连接/disconnect 断开,
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">send 发送/receive 接收, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">download 下载/upload 上传, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">refresh 刷新/synchronize 同步,
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">update 更新/revert 复原, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">lock 锁定/unlock 解锁, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">check out 签出/check in 签入, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">submit 提交/commit 交付, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">push 推/pull 拉,
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">expand 展开/collapse 折叠, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">enter 进入/exit 退出,
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">abort 放弃/quit 离开, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">obsolete 废弃/depreciate 废旧, 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">collect 收集/aggregate 聚集
</span></span></pre>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lake-embed-toolbar lake-card-toolbar lake-embed-toolbar-block" contenteditable="false">
                    <div class="lake-embed-toolbar-group" data-aspm="card-toolbar"><span
                            class="lake-embed-toolbar-item lake-embed-toolbar-item-copyContent">
                            <a class="lake-embed-toolbar-btn " data-aspm-click="copyContent" data-aspm-param="unknown">
                                <span class="lake-icon lake-icon-copyContent"></span>
                            </a>
                        </span></div>
                </div>
            </div>
        </div>
        <div data-card-type="block" data-lake-card="codeblock" contenteditable="false"
            data-card-value="data:%7B%22mode%22%3A%22plain%22%2C%22code%22%3A%22%2F%2F%20undefined%20%E5%88%A4%E6%96%AD%5Cnif%20(typeof%20person%20%3D%3D%3D%20'undefined')%20%7B%5Cn%20%20doSomething()%3B%5Cn%7D%5Cn%5Cn%2F%2F%20%E5%AD%97%E7%AC%A6%E4%B8%B2%20%E7%BB%9F%E4%B8%80%E4%BD%BF%E7%94%A8%E5%8D%95%E5%BC%95%E5%8F%B7('')%EF%BC%8C%E4%B8%8D%E4%BD%BF%E7%94%A8%E5%8F%8C%E5%BC%95%E5%8F%B7(%5C%22%5C%22)%E3%80%82%5Cn%2F%2F%20%E8%BF%99%E5%9C%A8%E5%88%9B%E5%BB%BA%20HTML%20%E5%AD%97%E7%AC%A6%E4%B8%B2%E9%9D%9E%E5%B8%B8%E6%9C%89%E5%A5%BD%E5%A4%84%20vscode%20%E9%85%8D%E7%BD%AE%20%5Cn%2F%2F%20settings.json%20%E6%88%96%E8%80%85%20.eslintrc.js%20%E6%88%96%E8%80%85%20.prettierrc.json%5Cnlet%20str%20%3D%20'foo'%3B%5Cnlet%20testDiv%20%3D%20'%3Cdiv%20id%3D%5C%22test%5C%22%3E%3C%2Fdiv%3E'%3B%5Cn%22%2C%22heightLimit%22%3Atrue%2C%22margin%22%3Atrue%2C%22id%22%3A%22Lltsj%22%7D"
            id="Lltsj" class="lake-card-margin">
            <div data-card-element="body">
                <div data-card-element="center">
                    <div class="lake-codeblock lake-codeblock-plain height-limit">
                        <div class="lake-codeblock-content">
                            <div class="CodeMirror CodeMirror-sizer">
                                <pre class="cm-s-default"><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">// undefined 判断
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">if (typeof person === 'undefined') {
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">  doSomething();
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">}
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">// 字符串 统一使用单引号('')，不使用双引号("")。
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">// 这在创建 HTML 字符串非常有好处 vscode 配置 
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">// settings.json 或者 .eslintrc.js 或者 .prettierrc.json
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">let str = 'foo';
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">let testDiv = '&lt;div id="test"&gt;&lt;/div&gt;';
</span></span></pre>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lake-embed-toolbar lake-card-toolbar lake-embed-toolbar-block" contenteditable="false">
                    <div class="lake-embed-toolbar-group" data-aspm="card-toolbar"><span
                            class="lake-embed-toolbar-item lake-embed-toolbar-item-copyContent">
                            <a class="lake-embed-toolbar-btn " data-aspm-click="copyContent" data-aspm-param="unknown">
                                <span class="lake-icon lake-icon-copyContent"></span>
                            </a>
                        </span></div>
                </div>
            </div>
        </div>
        <p data-lake-id="6493296152574f31fe01c9b9207c0105"><br></p>
        <h3 data-lake-id="64462d20accee8f39515f60e967996f7" id="slide-15">(五) Vue 规范</h3>
        <ol data-lake-id="a6f28f11b5a72e4b87ebe5de6fe22ed4">
            <li data-lake-id="ebbb8a969b6b9ffcfc97ee895b81203c" style="padding-left: 6px;">组件名为多个单词</li>
            <li data-lake-id="604cbb0949315b26e391465e169b0bcf" style="padding-left: 6px;">组件文件名为 pascal-case 格式</li>
            <li data-lake-id="5f201acea3d2532371efa0ef460289a6" style="padding-left: 6px;">基础组件文件名为 base 开头，使用完整单词而不是缩写。
            </li>
            <li data-lake-id="c0555dbd235d38b530b7b34daef0592c" style="padding-left: 6px;">和父组件紧密耦合的子组件应该以父组件名作为前缀命名
            </li>
        </ol>
        <p data-lake-id="572135db4effc1c914d0264f7fe4cc02"><br></p>
        <div data-card-type="block" data-lake-card="codeblock" contenteditable="false"
            data-card-value="data:%7B%22mode%22%3A%22plain%22%2C%22code%22%3A%22%2F%2F%20components%2Fbase-input.vue%5Cn%5Cn%2F%2F%20components%2Ftodo-list.vue%5Cn%2F%2F%20components%2Ftodo-list-item.vue%5Cn%5Cn%2F%2F%20%E6%AD%A3%E4%BE%8B%5Cnexport%20default%20%7B%5Cn%20%20name%3A%20'TodoItem'%5Cn%7D%3B%5Cn%5Cn%2F%2F%20%E5%8F%8D%E4%BE%8B%5Cnexport%20default%20%7B%5Cn%20%20name%3A%20'Todo'%2C%5Cn%7D%5Cnexport%20default%20%7B%5Cn%20%20name%3A%20'todo-item'%2C%5Cn%7D%5Cn%22%2C%22heightLimit%22%3Atrue%2C%22margin%22%3Atrue%2C%22id%22%3A%22Vc2RG%22%7D"
            id="Vc2RG" class="lake-card-margin">
            <div data-card-element="body">
                <div data-card-element="center">
                    <div class="lake-codeblock lake-codeblock-plain height-limit">
                        <div class="lake-codeblock-content">
                            <div class="CodeMirror CodeMirror-sizer">
                                <pre class="cm-s-default"><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">// components/base-input.vue
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">// components/todo-list.vue
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">// components/todo-list-item.vue
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">// 正例
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">export default {
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">  name: 'TodoItem'
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">};
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">// 反例
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">export default {
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">  name: 'Todo',
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">}
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">export default {
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">  name: 'todo-item',
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">}
</span></span></pre>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lake-embed-toolbar lake-card-toolbar lake-embed-toolbar-block" contenteditable="false">
                    <div class="lake-embed-toolbar-group" data-aspm="card-toolbar"><span
                            class="lake-embed-toolbar-item lake-embed-toolbar-item-copyContent">
                            <a class="lake-embed-toolbar-btn " data-aspm-click="copyContent" data-aspm-param="unknown">
                                <span class="lake-icon lake-icon-copyContent"></span>
                            </a>
                        </span></div>
                </div>
            </div>
        </div>
        <ol start="5" data-lake-id="8444d39a82f2d8d637d557577a903017">
            <li data-lake-id="fbac401820dc75e9d91de06e91497b9d" style="padding-left: 6px;">在 Template 模版中使用组件，应使用
                PascalCase 模式，并且使用自闭合组件。</li>
        </ol>
        <div data-card-type="block" data-lake-card="codeblock" contenteditable="false"
            data-card-value="data:%7B%22mode%22%3A%22plain%22%2C%22code%22%3A%22%3C!--%20%E5%9C%A8%E5%8D%95%E6%96%87%E4%BB%B6%E7%BB%84%E4%BB%B6%E3%80%81%E5%AD%97%E7%AC%A6%E4%B8%B2%E6%A8%A1%E6%9D%BF%E5%92%8C%20JSX%20%E4%B8%AD%20--%3E%5Cn%3CMyComponent%20%2F%3E%5Cn%3CRow%3E%3Ctable%20%3Acolumn%3D%5C%22data%5C%22%2F%3E%3C%2FRow%3E%5Cn%5Cn%3C!--%20%E5%8F%8D%E4%BE%8B%20--%3E%5Cn%3Cmy-component%20%2F%3E%20%3Crow%3E%3Ctable%20%3Acolumn%3D%5C%22data%5C%22%2F%3E%3C%2Frow%3E%5Cn%22%2C%22heightLimit%22%3Atrue%2C%22margin%22%3Atrue%2C%22id%22%3A%22oEKct%22%7D"
            id="oEKct" class="lake-card-margin">
            <div data-card-element="body">
                <div data-card-element="center">
                    <div class="lake-codeblock lake-codeblock-plain height-limit">
                        <div class="lake-codeblock-content">
                            <div class="CodeMirror CodeMirror-sizer">
                                <pre class="cm-s-default"><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">&lt;!-- 在单文件组件、字符串模板和 JSX 中 --&gt;
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">&lt;MyComponent /&gt;
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">&lt;Row&gt;&lt;table :column="data"/&gt;&lt;/Row&gt;
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">&lt;!-- 反例 --&gt;
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">&lt;my-component /&gt; &lt;row&gt;&lt;table :column="data"/&gt;&lt;/row&gt;
</span></span></pre>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lake-embed-toolbar lake-card-toolbar lake-embed-toolbar-block" contenteditable="false">
                    <div class="lake-embed-toolbar-group" data-aspm="card-toolbar"><span
                            class="lake-embed-toolbar-item lake-embed-toolbar-item-copyContent">
                            <a class="lake-embed-toolbar-btn " data-aspm-click="copyContent" data-aspm-param="unknown">
                                <span class="lake-icon lake-icon-copyContent"></span>
                            </a>
                        </span></div>
                </div>
            </div>
        </div>
        <p data-lake-id="fe7440c47ae0d029629f946e8989ca97"><br></p>
        <ol start="6" data-lake-id="e32ee40df6717f7f88e2ab7a794959a5">
            <li data-lake-id="bc2d16eba2b11bbb00db931a49fe8c3a">Prop 定义应该尽量详细</li>
        </ol>
        <ol data-lake-id="46a5b3acbe16560936f1e94e1109b04a" data-lake-indent="1">
            <li data-lake-id="60c4f853dd02200cd05698928a134194" style="padding-left: 6px;">必须使用 camelCase 驼峰命名</li>
            <li data-lake-id="31db7b236d7ef96f30f86d4242e15360" style="padding-left: 6px;">必须指定类型</li>
            <li data-lake-id="9963331ab87c4b50410a781abecb35ad" style="padding-left: 6px;">必须加上注释，表明其含义</li>
            <li data-lake-id="cc1b688250ec046b0b8fac2aa0413f2a" style="padding-left: 6px;">必须加上 required 或者
                default，两者二选其一</li>
            <li data-lake-id="0400e860f9cabf16947dcc6f73a3d309" style="padding-left: 6px;">如果有业务需要，必须加上 validator 验证
            </li>
        </ol>
        <div data-card-type="block" data-lake-card="codeblock" contenteditable="false"
            data-card-value="data:%7B%22mode%22%3A%22plain%22%2C%22code%22%3A%22props%3A%20%7B%5Cn%20%20%2F%2F%20%E7%BB%84%E4%BB%B6%E7%8A%B6%E6%80%81%EF%BC%8C%E7%94%A8%E4%BA%8E%E6%8E%A7%E5%88%B6%E7%BB%84%E4%BB%B6%E7%9A%84%E9%A2%9C%E8%89%B2%5Cn%20%20status%3A%20%7B%5Cn%20%20%20%20type%3A%20String%2C%5Cn%20%20%20%20required%3A%20true%2C%5Cn%20%20%20%20validator%3A%20function%20(value)%20%7B%5Cn%20%20%20%20%20%20return%20%5B%5Cn%20%20%20%20%20%20%20%20'succ'%2C%5Cn%20%20%20%20%20%20%20%20'info'%2C%5Cn%20%20%20%20%20%20%20%20'error'%5Cn%20%20%20%20%20%20%5D.indexOf(value)%20!%3D%3D%20-1%5Cn%20%20%20%20%7D%5Cn%20%20%7D%2C%5Cn%20%20%2F%2F%20%E7%94%A8%E6%88%B7%E7%BA%A7%E5%88%AB%EF%BC%8C%E7%94%A8%E4%BA%8E%E6%98%BE%E7%A4%BA%E7%9A%87%E5%86%A0%E4%B8%AA%E6%95%B0%5Cn%20%20userLevel%3A%20%7B%5Cn%20%20%20%20type%3A%20String%2C%5Cn%20%20%20%20required%3A%20true%5Cn%20%20%7D%5Cn%7D%5Cn%22%2C%22heightLimit%22%3Atrue%2C%22margin%22%3Atrue%2C%22id%22%3A%22oDBls%22%7D"
            id="oDBls" class="lake-card-margin">
            <div data-card-element="body">
                <div data-card-element="center">
                    <div class="lake-codeblock lake-codeblock-plain height-limit">
                        <div class="lake-codeblock-content">
                            <div class="CodeMirror CodeMirror-sizer">
                                <pre class="cm-s-default"><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">props: {
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">  // 组件状态，用于控制组件的颜色
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">  status: {
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">    type: String,
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">    required: true,
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">    validator: function (value) {
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">      return [
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">        'succ',
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">        'info',
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">        'error'
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">      ].indexOf(value) !== -1
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">    }
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">  },
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">  // 用户级别，用于显示皇冠个数
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">  userLevel: {
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">    type: String,
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">    required: true
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">  }
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">}
</span></span></pre>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lake-embed-toolbar lake-card-toolbar lake-embed-toolbar-block" contenteditable="false">
                    <div class="lake-embed-toolbar-group" data-aspm="card-toolbar"><span
                            class="lake-embed-toolbar-item lake-embed-toolbar-item-copyContent">
                            <a class="lake-embed-toolbar-btn " data-aspm-click="copyContent" data-aspm-param="unknown">
                                <span class="lake-icon lake-icon-copyContent"></span>
                            </a>
                        </span></div>
                </div>
            </div>
        </div>
        <ol start="7" data-lake-id="28b9266ee680fd2be5611f74fa6d9473">
            <li data-lake-id="9a09cda0a1df9eff2bd1bb19aad7e045" style="padding-left: 6px;">模板中使用简单的表达式</li>
        </ol>
        <p data-lake-id="e15a084b378f0b83d69ac96e5feb84f4">
            组件模板应该只包含简单的表达式，复杂的表达式则应该重构为计算属性或方法。复杂表达式会让你的模板变得不那么声明式。我们应该尽量描述应该出现的是什么，而非如何计算那个值。而且计算属性和方法使得代码可以重用。</p>
        <div data-card-type="block" data-lake-card="codeblock" contenteditable="false"
            data-card-value="data:%7B%22mode%22%3A%22plain%22%2C%22code%22%3A%22%3Ctemplate%3E%5Cn%20%20%3Cp%3E%7B%7B%20normalizedFullName%20%7D%7D%3C%2Fp%3E%5Cn%3C%2Ftemplate%3E%5Cn%2F%2F%20%E5%A4%8D%E6%9D%82%E8%A1%A8%E8%BE%BE%E5%BC%8F%E5%B7%B2%E7%BB%8F%E7%A7%BB%E5%85%A5%E4%B8%80%E4%B8%AA%E8%AE%A1%E7%AE%97%E5%B1%9E%E6%80%A7%5Cncomputed%3A%20%7B%5Cn%20%20normalizedFullName%3A%20function%20()%20%7B%5Cn%20%20%20%20return%20this.fullName.split('%20').map(function%20(word)%20%7B%5Cn%20%20%20%20%20%20return%20word%5B0%5D.toUpperCase()%20%2B%20word.slice(1)%5Cn%20%20%20%20%7D).join('%20')%5Cn%20%20%7D%5Cn%7D%5Cn%22%2C%22heightLimit%22%3Atrue%2C%22margin%22%3Atrue%2C%22id%22%3A%22SYfjF%22%7D"
            id="SYfjF" class="lake-card-margin">
            <div data-card-element="body">
                <div data-card-element="center">
                    <div class="lake-codeblock lake-codeblock-plain height-limit">
                        <div class="lake-codeblock-content">
                            <div class="CodeMirror CodeMirror-sizer">
                                <pre class="cm-s-default"><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">&lt;template&gt;
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">  &lt;p&gt;{{ normalizedFullName }}&lt;/p&gt;
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">&lt;/template&gt;
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">// 复杂表达式已经移入一个计算属性
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">computed: {
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">  normalizedFullName: function () {
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">    return this.fullName.split(' ').map(function (word) {
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">      return word[0].toUpperCase() + word.slice(1)
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">    }).join(' ')
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">  }
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">}
</span></span></pre>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lake-embed-toolbar lake-card-toolbar lake-embed-toolbar-block" contenteditable="false">
                    <div class="lake-embed-toolbar-group" data-aspm="card-toolbar"><span
                            class="lake-embed-toolbar-item lake-embed-toolbar-item-copyContent">
                            <a class="lake-embed-toolbar-btn " data-aspm-click="copyContent" data-aspm-param="unknown">
                                <span class="lake-icon lake-icon-copyContent"></span>
                            </a>
                        </span></div>
                </div>
            </div>
        </div>
        <p data-lake-id="849989c772b4d6e1508aff4a06d6b1ed"><br></p>
        <h2 data-lake-id="de871538aff62d4dea309db98f01c579" id="slide-16">涉及的插件与配置文件</h2>
        <p data-lake-id="f020c1319107d8d0ef33e4bc577dd850">默认使用开发工具 VScode</p>
        <blockquote>
            <p data-lake-id="f145af8da18bd40241f482cb2d1a51eb"><a
                    href="https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fprettier%2Fprettier-vscode"
                    target="_blank" ref="nofollow noopener noreferrer" rel="noopener noreferrer">Prettier</a></p>
        </blockquote>
        <p data-lake-id="0f52cdaefb55f3138ed30b826ae94ed0">代码美化，自动格式化成规范格式</p>
        <blockquote>
            <p data-lake-id="aeae26f42f629dff582e2eeb8c05be11"><a
                    href="https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fstylelint%2Fvscode-stylelint"
                    target="_blank" ref="nofollow noopener noreferrer" rel="noopener noreferrer">Stylelint</a></p>
        </blockquote>
        <p data-lake-id="507ba329354acb0e4c36ab2d7a1a91c1">样式代码规范 <code>.vscode/settings.json</code></p>
        <blockquote>
            <p data-lake-id="86cb18c85cd2cf9639b3e453b6b852bf"><a
                    href="https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FMicrosoft%2Fvscode-eslint"
                    target="_blank" ref="nofollow noopener noreferrer" rel="noopener noreferrer">eslint</a></p>
            <p data-lake-id="509faa00b8e41751d81fcf6bf6e1625c"><a
                    href="https://link.juejin.cn?target=https%3A%2F%2Fvuejs.github.io%2Fvetur%2Fguide%2Fhighlighting.html%23custom-block"
                    target="_blank" ref="nofollow noopener noreferrer" rel="noopener noreferrer">vetur</a></p>
        </blockquote>
        <p data-lake-id="db36d9623dd054167ed60f11217ea343">配置文件 <code>.editorconfig</code></p>
        <p data-lake-id="0df24839ed476a1f8dfa9868d438ee07"><br></p>
        <div data-card-type="block" data-lake-card="codeblock" contenteditable="false"
            data-card-value="data:%7B%22mode%22%3A%22plain%22%2C%22code%22%3A%22%23%20%40see%3A%20http%3A%2F%2Feditorconfig.org%5Cn%5Cnroot%20%3D%20true%5Cn%5Cn%5B*%5D%20%23%20%E8%A1%A8%E7%A4%BA%E6%89%80%E6%9C%89%E6%96%87%E4%BB%B6%E9%80%82%E7%94%A8%5Cncharset%20%3D%20utf-8%20%23%20%E8%AE%BE%E7%BD%AE%E6%96%87%E4%BB%B6%E5%AD%97%E7%AC%A6%E9%9B%86%E4%B8%BA%20utf-8%5Cnend_of_line%20%3D%20lf%20%23%20%E6%8E%A7%E5%88%B6%E6%8D%A2%E8%A1%8C%E7%B1%BB%E5%9E%8B(lf%20%7C%20cr%20%7C%20crlf)%5Cninsert_final_newline%20%3D%20true%20%23%20%E5%A7%8B%E7%BB%88%E5%9C%A8%E6%96%87%E4%BB%B6%E6%9C%AB%E5%B0%BE%E6%8F%92%E5%85%A5%E4%B8%80%E4%B8%AA%E6%96%B0%E8%A1%8C%5Cnindent_style%20%3D%20tab%20%23%20%E7%BC%A9%E8%BF%9B%E9%A3%8E%E6%A0%BC%EF%BC%88tab%20%7C%20space%EF%BC%89%5Cnindent_size%20%3D%202%20%23%20%E7%BC%A9%E8%BF%9B%E5%A4%A7%E5%B0%8F%5Cnmax_line_length%20%3D%20130%20%23%20%E6%9C%80%E5%A4%A7%E8%A1%8C%E9%95%BF%E5%BA%A6%5Cn%5Cn%5B*.md%5D%20%23%20%E8%A1%A8%E7%A4%BA%E4%BB%85%20md%20%E6%96%87%E4%BB%B6%E9%80%82%E7%94%A8%E4%BB%A5%E4%B8%8B%E8%A7%84%E5%88%99%5Cnmax_line_length%20%3D%20off%20%23%20%E5%85%B3%E9%97%AD%E6%9C%80%E5%A4%A7%E8%A1%8C%E9%95%BF%E5%BA%A6%E9%99%90%E5%88%B6%5Cntrim_trailing_whitespace%20%3D%20false%20%23%20%E5%85%B3%E9%97%AD%E6%9C%AB%E5%B0%BE%E7%A9%BA%E6%A0%BC%E4%BF%AE%E5%89%AA%5Cn%22%2C%22heightLimit%22%3Atrue%2C%22margin%22%3Atrue%2C%22id%22%3A%22F8oFR%22%7D"
            id="F8oFR" class="lake-card-margin">
            <div data-card-element="body">
                <div data-card-element="center">
                    <div class="lake-codeblock lake-codeblock-plain height-limit">
                        <div class="lake-codeblock-content">
                            <div class="CodeMirror CodeMirror-sizer">
                                <pre class="cm-s-default"><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content"># @see: http://editorconfig.org
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">root = true
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">[*] # 表示所有文件适用
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">charset = utf-8 # 设置文件字符集为 utf-8
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">end_of_line = lf # 控制换行类型(lf | cr | crlf)
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">insert_final_newline = true # 始终在文件末尾插入一个新行
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-1"></span><span class="lake-preview-codeblock-content">indent_style = tab # 缩进风格（tab | space）
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">indent_size = 2 # 缩进大小
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">max_line_length = 130 # 最大行长度
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">[*.md] # 表示仅 md 文件适用以下规则
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">max_line_length = off # 关闭最大行长度限制
</span></span><span class="lake-preview-line"><span class="lake-preview-line-number lake-lm-pad-level-0"></span><span class="lake-preview-codeblock-content">trim_trailing_whitespace = false # 关闭末尾空格修剪
</span></span></pre>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lake-embed-toolbar lake-card-toolbar lake-embed-toolbar-block" contenteditable="false">
                    <div class="lake-embed-toolbar-group" data-aspm="card-toolbar"><span
                            class="lake-embed-toolbar-item lake-embed-toolbar-item-copyContent">
                            <a class="lake-embed-toolbar-btn " data-aspm-click="copyContent" data-aspm-param="unknown">
                                <span class="lake-icon lake-icon-copyContent"></span>
                            </a>
                        </span></div>
                </div>
            </div>
        </div>
        <p data-lake-id="698bc11210d4d31ba4c1b669a4e0c99a"><br></p>
        <h2 data-lake-id="3ab921d004a8a711728d7bb823c6fcfb" id="slide-17">参考资料</h2>
        <p data-lake-id="d06b92f5e1daae6dcd057851485f5118"><a
                href="https://link.juejin.cn/?target=https%3A%2F%2Fdeveloper.aliyun.com%2Farticle%2F850913"
                target="_blank" ref="nofollow noopener noreferrer" rel="noopener noreferrer">阿里代码规范（前端篇）</a></p>
    </div>
</div>