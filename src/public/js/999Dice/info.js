function init(){
    console.log('hello 999Dice');
}

function checkParams(p,ch){
    //console.log(p,ch);
    if(p < 0.00000001 || p > 1000000000*1000000000) {
        return false
    }
    if(ch>95 || ch<5) {
        return false
    }
    return true;
}


function initScriptBalance(currencyValue, cb){
    getInfo(function(userinfo){
        if(userinfo.Balances.length>0){
            try {
                balance = parseFloat(userinfo.Balances[currencyValue].Balance/100000000).toFixed(8);
                bets = userinfo.CurrentBalances[currencyValue].TotalBets;
                wins = userinfo.CurrentBalances[currencyValue].TotalWins;
                losses = (userinfo.CurrentBalances[currencyValue].TotalBets-userinfo.CurrentBalances[currencyValue].TotalWins);
                profit = ((userinfo.CurrentBalances[currencyValue].TotalPayIn+userinfo.CurrentBalances[currencyValue].TotalPayOut)/100000000).toFixed(8);
            } catch(err){
                console.error(err.message);
                webix.message({type: 'error', text: err.message});
                return false;
            }
            cb();
        }
    });
}

function getBalance(userinfo){
    currencyValue = $$("bet_currency_selection").getValue() -1;
    balance = (userinfo.Balances[currencyValue].Balance/100000000).toFixed(8)
    return balance;
}

function outError(ret){
    let mess = ret.error;
    if(ret.NoPossibleProfit == 1) {
        mess = 'NoPossibleProfit';
    }
    return checkerr(mess);
}

function isError(ret){
    if(ret.BetId)
        return true;
    else
        return false;
}

function getWinStatus(ret){
    //console.log('win status:'+ ret.Win);
    return ret.Win;
}

function getProfit(userinfo,currencyValue){
    profit = ((userinfo.CurrentBalances[currencyValue].TotalPayIn+userinfo.CurrentBalances[currencyValue].TotalPayOut)/100000000).toFixed(8);
    //console.log('actprofit:'+actProfit);
    return profit;
}

function getCurrProfit(ret){
    currentprofit = ((ret.PayOut-ret.PayIn)/100000000).toFixed(8)
    //console.log('currprofit:'+currProfit);
    return currentprofit;
}

function getCurrentBetId(ret){
    let betId = ret.betInfo.id;
    //console.log('currentBetId:'+betId);
    return betId;
}

function getCurrentRoll(ret){
    currentroll = ret.Secret/10000;
    //console.log('currentRoll:'+roll);
    return currentroll;
}


function setDatatable(ret, iswin){
    let chanceStr = '<font size="3" color="red">'+ ret.High + ' '+ ret.BetRoll/10000 +'</font>';
    if(iswin){
        chanceStr = '<font size="3" color="green">'+ ret.High + ' '+ ret.BetRoll/10000 +'</font>';
    }
    let profitStr = '<font size="3" color="red">' +((ret.PayOut-ret.PayIn)/100000000).toFixed(8) + '</font>';
    if((ret.PayOut-ret.PayIn)>0) {
        profitStr = '<font size="3" color="green">' +((ret.PayOut-ret.PayIn)/100000000).toFixed(8) + '</font>';
    }
    $$('bet_datatable').add({
        bet_datatable_id:ret.BetId,
        bet_datatable_amount:(ret.PayIn/100000000).toFixed(8),
        bet_datatable_low_high:ret.High,
        bet_datatable_payout:(ret.PayOut/100000000).toFixed(8),
        bet_datatable_bet_chance:chanceStr,
        bet_datatable_actual_chance:ret.Secret/10000,
        bet_datatable_profit:profitStr,
    },0);
}

function setStats(userinfo, currencyValue){
    $$('bet_total_stats').setValues({
        bet_total_stats_balance:parseFloat(userinfo.Balances[currencyValue].Balance/100000000).toFixed(8),
        bet_total_stats_win:userinfo.Balances[currencyValue].TotalWins,
        bet_total_stats_loss:(userinfo.Balances[currencyValue].TotalBets-userinfo.Balances[currencyValue].TotalWins),
        bet_total_stats_bet:userinfo.Balances[currencyValue].TotalBets,
        bet_total_stats_profit:((userinfo.Balances[currencyValue].TotalPayIn+userinfo.Balances[currencyValue].TotalPayOut)/100000000).toFixed(8),
        bet_total_stats_wagered:(Math.abs(userinfo.Balances[currencyValue].TotalPayIn)/100000000).toFixed(8),
    });
    $$('bet_current_stats').setValues({
        bet_current_stats_balance:parseFloat(userinfo.CurrentBalances[currencyValue].Balance/100000000).toFixed(8),
        bet_current_stats_win:userinfo.CurrentBalances[currencyValue].TotalWins,
        bet_current_stats_loss:(userinfo.CurrentBalances[currencyValue].TotalBets-userinfo.CurrentBalances[currencyValue].TotalWins),
        bet_current_stats_bet:userinfo.CurrentBalances[currencyValue].TotalBets,
        bet_current_stats_profit:((userinfo.CurrentBalances[currencyValue].TotalPayIn+userinfo.CurrentBalances[currencyValue].TotalPayOut)/100000000).toFixed(8),
        bet_current_stats_wagered:(Math.abs(userinfo.CurrentBalances[currencyValue].TotalPayIn)/100000000).toFixed(8),
    });
} 
