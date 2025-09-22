const BankServer = (function(){
  const _token = Symbol('private');
  class BankServerClass {
    #accounts = new Map();
    #transactions = [];

    constructor(token){
      if(token!==_token) throw new Error("Use BankServer.getInstance()");
    }

    createAccount(name,balance=0){
      const id = "SBI" + Math.floor(Math.random()*10000);
      const acct = {id,name,balance:Number(balance)};
      this.#accounts.set(id,acct);
      this.#logTx("CREATE",`${name} (${id})`,acct.balance);
      return acct;
    }

    listAccounts(){ return Array.from(this.#accounts.values()); }
    getAccount(id){ return this.#accounts.get(id); }

    deposit(id,amt){ const a=this.getAccount(id); a.balance+=amt; this.#logTx("DEPOSIT",`${a.name}`,amt);}
    withdraw(id,amt){ const a=this.getAccount(id); a.balance-=amt; this.#logTx("WITHDRAW",`${a.name}`,-amt);}
    transfer(f,t,amt){ const a=this.getAccount(f),b=this.getAccount(t); a.balance-=amt;b.balance+=amt; this.#logTx("TRANSFER",`${a.name}->${b.name}`,amt); }

    getTransactions(limit=50){ return this.#transactions.slice(0,limit); }
    getCount(){ return this.#accounts.size; }
    getTotalBalance(){ return [...this.#accounts.values()].reduce((s,a)=>s+a.balance,0); }

    #logTx(type,details,amt){ this.#transactions.unshift({time:new Date().toISOString(),type,details,amount:amt}); }
  }

  let instance=null;
  return { getInstance(){ if(!instance) instance=new BankServerClass(_token); return instance; } };
})();

// Seed demo SBI accounts
const b = BankServer.getInstance();
if(b.getCount()===0){
  b.createAccount("Rahul Sharma",50000);
  b.createAccount("Neha Verma",75000);
  b.createAccount("Amit Singh",32000);
  b.createAccount("Priya Das",45000);
  b.createAccount("SBI Corporate Account",250000);
  b.deposit([...b.listAccounts()][0].id,5000);
  b.withdraw([...b.listAccounts()][1].id,2000);
  let ids=b.listAccounts().map(a=>a.id);
  b.transfer(ids[2],ids[3],3000);
}
