import {f_o_html_from_o_js} from "https://deno.land/x/f_o_html_from_o_js@0.7/mod.js";
import {
    f_add_css,
    f_s_css_prefixed
} from "https://deno.land/x/f_add_css@0.6/mod.js"


window.o_state = {
    b: true
};





    let o = {
        a_o:[
            {
                innerText: "hey"
            }
        ]
    }

    var o_html = f_o_html_from_o_js(o);
    document.body.className = 'theme_dark'
    document.body.appendChild(o_html)


    f_add_css('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    class O_hsla{
        constructor(n_h, n_s, n_l, n_a){
            this.n_h = n_h
            this.n_s = n_s
            this.n_l = n_l
            this.n_a = n_a
        }
    }
    let s_theme_light = 'theme_light'
    let s_theme_dark = 'theme_dark'
    let a_s_theme = [
        s_theme_light,
        s_theme_dark
    ]
    let o_themes_props = {
        // foreground
        //      light
        [`o_hsla__fg${s_theme_light}`]:                 new O_hsla(.0, .0, .1, .93), 
        [`o_hsla__fg_hover${s_theme_light}`]:           new O_hsla(.0, .0, .1, .93), 
        [`o_hsla__fg_active${s_theme_light}`]:          new O_hsla(.0, .0, .1, .93), 
        [`o_hsla__fg_active_hover${s_theme_light}`]:    new O_hsla(.0, .0, .1, .93), 
        //      dark
        [`o_hsla__fg${s_theme_dark}`]:                 new O_hsla(.0, .0, .8, .93), 
        [`o_hsla__fg_hover${s_theme_dark}`]:           new O_hsla(.0, .0, .9, .93), 
        [`o_hsla__fg_active${s_theme_dark}`]:          new O_hsla(.0, .0, .9, .93), 
        [`o_hsla__fg_active_hover${s_theme_dark}`]:    new O_hsla(.0, .0, .9, .93), 
        
        [`o_hsla__bg${s_theme_light}`]:                 new O_hsla(.0, .0, .1, .93), 
        [`o_hsla__bg_hover${s_theme_light}`]:           new O_hsla(.0, .0, .1, .93), 
        [`o_hsla__bg_active${s_theme_light}`]:          new O_hsla(.0, .0, .1, .93), 
        [`o_hsla__bg_active_hover${s_theme_light}`]:    new O_hsla(.0, .0, .1, .93), 
        // 
        [`o_hsla__bg${s_theme_dark}`]:                 new O_hsla(.0, .0, .1, .93), 
        [`o_hsla__bg_hover${s_theme_dark}`]:           new O_hsla(.0, .0, .2, .93), 
        [`o_hsla__bg_active${s_theme_dark}`]:          new O_hsla(.0, .0, .2, .93), 
        [`o_hsla__bg_active_hover${s_theme_dark}`]:    new O_hsla(.0, .0, .2, .93), 

    };

    let f_s_hsla = function(o_hsla){
        return `hsla(${360*o_hsla?.n_h} ${o_hsla?.n_s*100}% ${o_hsla?.n_l*100}% / ${o_hsla?.n_a})`
    }
    
    let s_core_css = `
    ${a_s_theme.map(s_theme =>{
        let o_theme_props = Object.assign(
            {}, 
            ...Object.keys(o_themes_props).filter(s=>s.includes(s_theme)).map(
                s_prop => {
                    let s_prop_without_s_theme = s_prop.replace(s_theme, '');

                    return {
                        [s_prop_without_s_theme]: o_themes_props[s_prop], 
                    }
                }
            )
        )
        return `
            .${s_theme} *, .${s_theme}{
                background: ${f_s_hsla(o_theme_props.o_hsla__bg)};
                color: ${f_s_hsla(o_theme_props.o_hsla__fg)};
            }
            .${s_theme} .clickable{
                padding:1rem;
                border-radius:3px;
            }
            .${s_theme} .clickable:hover{
                background: ${f_s_hsla(o_theme_props.o_hsla__bg_hover)};
                color: ${f_s_hsla(o_theme_props.o_hsla__fg_hover)};
                cursor:pointer;
            }
            .${s_theme} .clickable.clicked{
                background: ${f_s_hsla(o_theme_props.o_hsla__bg_active)};
                color: ${f_s_hsla(o_theme_props.o_hsla__fg_active)};
                cursor:pointer;
            }
            .${s_theme} .clickable.clicked:hover{
                background: ${f_s_hsla(o_theme_props.o_hsla__bg_active_hover)};
                color: ${f_s_hsla(o_theme_props.o_hsla__fg_active_hover)};
                cursor:pointer;
            }
        `
    }).join("\n")}
    body{
        min-height:100vh;
    }
    .position_relative{
        position:relative
    }
    .o_js_s_name_month_n_year{
        position:absolute;
        top:100%;
        left:0;
        width:100%;
    }
    input, button{
        border:none;
        outline:none;
        flex: 1 1 auto;
    }
    .input{
        display:flex;
    }

    .d_flex{
        display: flex;
        flex-wrap: wrap;
    }

    .w_1_t_7{
        align-items: center;
        display: flex;
        justify-content: center;
        flex: 1 1 calc(100%/7);
    }

    .w_1_t_3{
        align-items: center;
        display: flex;
        justify-content: center;
        flex:1 1 calc(100%/3);
    }
    *{
        font-size: 1.2rem;
        color: rgb(25 25 25 / 50%);
        background:white;
        padding: 0;
        margin:0;
    }
    .border_shadow_popup{
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
    }
    .theme_dark .border_shadow_popup{
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
    }
    *{
        font-family:helvetica;
    }
    ${(new Array(20).fill(0)).map(
        function(n, n_idx){
            let num = (n_idx /10)
            let s_n = num.toString().split('.').join('_');
            return `
                .p-${s_n}_rem{padding: ${num}rem}
                .pl-${s_n}_rem{padding-left: ${num}rem}
                .pr-${s_n}_rem{padding-right: ${num}rem}
                .pt-${s_n}_rem{padding-top: ${num}rem}
                .pb-${s_n}_rem{padding-bottom: ${num}rem}
            `
        }
    ).join("\n")} `;
    let s_css = `
            ${s_core_css}
            .app, .inputs{
                display:flex;
                flex-direction: column;
                height: 100vh;
                overflow:hidden;
            }
    `;
    // let s_css_prefixed = f_s_css_prefixed(
    //     s_css,
    //     `.${s_version_class}`
    // );
    f_add_css(s_css)



