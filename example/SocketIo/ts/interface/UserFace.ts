export interface UserFace {
  /** register one*/register(user)
  /** login one*/login(account:string,pwd:string)
  /** change pwd*/fix(id:number,user)
}