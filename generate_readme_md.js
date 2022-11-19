var s_content = await Deno.readTextFile("./test.js")
// console.log(s_content)

var a_s_line = s_content.split("\n");

var s_md = ''
var b_markdown_code_block = false;
var b_markdown_stdt_block = false;
for(var s_line of a_s_line){

    if(
        s_line.indexOf("//```") == 0
    ){
        b_markdown_code_block = !b_markdown_code_block;
        if(!b_markdown_code_block){
            s_md += '```\n'
        }
        if(b_markdown_code_block){
            s_md+=`${s_line.slice(2)}\n`
        }
    }
    if(b_markdown_code_block){
        if(s_line.indexOf("```") == -1){
            s_md += `${s_line}\n`;
        }
    }
    
    if(s_line.indexOf("//md") == 0){
        s_md+=`${s_line.slice(4)}\n`
        console.log(s_md)
    }
    if(s_line.indexOf("/*md") == 0){
        b_markdown_stdt_block = true;
    }
    if(s_line.indexOf("md*/") == 0){
        b_markdown_stdt_block = false;
    }
    if(
        b_markdown_stdt_block
        && s_line.indexOf("/*md") == -1
        && s_line.indexOf("md*/") == -1
    ){
        s_md += `${s_line.trim()}\n`;
    }

}

Deno.writeTextFile('./readme.md', s_md);