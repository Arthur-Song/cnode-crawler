/**
 * Created by Arthur on 2016/6/11.
 */
var superagent=require("superagent");
var cheerio=require("cheerio");
var url=require("url");

var cnodeUrl="http://cnodejs.org/";
var CNode=function(url){
    cnodeUrl=url;
}

CNode.prototype={
    getData:function(res){
        //使用superagent获取数据
        superagent.get(cnodeUrl)
            .end(function(err,sres){
                //错误处理
                if(err){
                    return next(err);
                }
                //cheerio解析
                var $=cheerio.load(sres.text);
                //获取总页数
                var lastPageUrl=$(".pagination ul li:last-child").find("a").attr("href");
                //防止最后一页href为空
                var totalPages;
                if(lastPageUrl==undefined){
                    var page=$(".pagination").attr("current_page");
                    console.log(page);
                    totalPages=page;
                }else{
                    var queryObj=url.parse(lastPageUrl,true).query;
                    totalPages=queryObj.page;
                }
                //解析列表
                var items=[];
                $("#topic_list .cell").each(function(index,element){
                    var $element=$(element);
                    var replies=$element.find(".count_of_replies").text().trim(); //回复数
                    var hits=$element.find(".count_of_visits").text().trim(); //点击数
                    var tabType=$element.find(".topiclist-tab").text().trim(); //类型：分享，置顶...
                    var itemTitle=$element.find(".topic_title").attr("title");
                    var path=$element.find(".topic_title").attr("href");

                    items.push({
                        title:itemTitle,
                        href:path,
                        link:url.resolve(cnodeUrl,path),
                        hits:hits,
                        replies:replies,
                        tab:tabType
                    });
                });
                items.totalPages=totalPages;
                res.locals.title="资源列表";
                res.locals.items=items;
                res.render("list");
            });
    }
};

module.exports=CNode;
