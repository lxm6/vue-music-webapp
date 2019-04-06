
export function openUrl(url) {
    function plusReady() {
        var first = null;
        var flag = false;
        var embed = plus.webview.create(url);
        embed.addEventListener(
          "loading",
          function(e) {
            plus.nativeUI.showWaiting(); //加载中，显示加载效果
          },
          false
        );
        embed.addEventListener(
          "loaded",
          function(e) {
            plus.nativeUI.closeWaiting(); //加载完毕，关闭加载效果
            embed.show("slide-in-right"); //显示页面
          },
          false
        );
        mui.back = function() {
          embed.canBack(function(e) {
            if (e.canBack) {
              embed.back();
            } else {
              embed.close();
              flag = true;
            }
          });
          if (flag) {
            if (window.location.href === "https://www.lxm6.top/#/recommend") {
              if (!first) {
                first = new Date().getTime(); //记录第一次按下回退键的时间
                mui.toast("再按一次退出应用"); //给出提示
                setTimeout(function() {
                  //1s中后清除
                  first = null;
                }, 1000);
              } else {
                if (new Date().getTime() - first < 1000) {
                  //如果两次按下的时间小于1s，
                  plus.runtime.quit(); //那么就退出app
                }
              }
            } else {
              history.go(-1); //回退到上一页面
            }
          }
        };
      }
      if (window.plus) {
        plusReady();
      } else {
        window.open(url);
        document.addEventListener("plusready", plusReady, false);
      }
  }