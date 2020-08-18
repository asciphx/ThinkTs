export interface UserFace{
  /** register one*/register(entity)
  /** login one*/login(entity)
  /** search all*/all()
  /** search one*/one(id:number)
  /** save one*/save(entity)
  /** update one*/update(id:number,entity)
  /** remove one*/remove(id:number)
}