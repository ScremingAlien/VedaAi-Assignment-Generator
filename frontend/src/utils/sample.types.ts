/* 
//////////////////////////////////////////////////////
//////////////////// ENUMS ///////////////////////////
//////////////////////////////////////////////////////

export enum PartyType {
  CUSTOMER = "CUSTOMER",
  SUPPLIER = "SUPPLIER",
}

export enum WorkStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
}

export enum InvoiceStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  CANCELLED = "CANCELLED",
}

export enum LedgerReferenceType {
  INVOICE = "INVOICE",
  PAYMENT = "PAYMENT",
  PURCHASE = "PURCHASE",
  ADJUSTMENT = "ADJUSTMENT",
  OPENING_BALANCE = "OPENING_BALANCE",
}

//////////////////////////////////////////////////////
//////////////////// PARTY ///////////////////////////
//////////////////////////////////////////////////////

export type Party = {
  id: string
  name: string
  phone?: string | null
  gstNumber?: string | null
  address?: string | null
  stateCode?: string | null
  type: PartyType

  isActive: boolean

  createdBy?: string | null
  updatedBy?: string | null

  createdAt: string
  updatedAt: string
}

//////////////////////////////////////////////////////
//////////////////// WORKERS /////////////////////////
//////////////////////////////////////////////////////

export type Worker = {
  id: string
  name: string
  phone?: string | null
  skillType?: string | null
  defaultWage: number

  isActive: boolean

  createdAt: string
}

//////////////////////////////////////////////////////
//////////////////// FINANCIAL YEAR //////////////////
//////////////////////////////////////////////////////

export type FinancialYear = {
  id: string
  label: string

  startDate?: string | null
  endDate?: string | null

  isActive: boolean
  isClosed: boolean

  createdAt: string
}

//////////////////////////////////////////////////////
//////////////////// WORK ORDER //////////////////////
//////////////////////////////////////////////////////

export type WorkOrder = {
  id: string

  title: string
  description?: string | null

  partyId?: string | null
  party?: Party

  status: WorkStatus

  startDate: string
  endDate?: string | null

  estimatedCost?: number | null

  createdAt: string
  updatedAt: string
}

//////////////////////////////////////////////////////
//////////////////// ATTENDANCE //////////////////////
//////////////////////////////////////////////////////

export type AttendanceDay = {
  id: string

  date: string

  year: number
  month: number
  day: number
}

export type AttendanceItem = {
  id: string

  attendanceDayId: string
  workerId: string

  status: AttendanceStatus

  hoursWorked?: number | null
  wage?: number | null

  worker?: Worker
  attendanceDay?: AttendanceDay
}

//////////////////////////////////////////////////////
//////////////////// QUOTATION ///////////////////////
//////////////////////////////////////////////////////

export type Quotation = {
  id: string

  partyId: string
  party?: Party

  issueDate: string

  month?: number | null
  year?: number | null

  taxableAmount: number

  sgst: number
  cgst: number
  igst: number

  roundOff: number
  totalAmount: number

  status: InvoiceStatus

  createdAt: string

  items?: QuotationItem[]
}

export type QuotationItem = {
  id: string

  quotationId: string

  description: string
  subdescription: string[]

  hsnCode?: string | null
  unit?: string | null

  quantity: number
  rate: number
  amount: number
}

//////////////////////////////////////////////////////
//////////////////// INVOICE /////////////////////////
//////////////////////////////////////////////////////

export type Invoice = {
  id: string

  invoiceNumber: string
  issueDate: string

  month?: number | null
  year?: number | null

  partyId: string
  party?: Party

  shipToId?: string | null
  shipTo?: Party | null

  chNo?: string | null
  poNo?: string | null
  stateCode?: string | null

  taxableAmount: number

  sgst: number
  cgst: number
  igst: number

  roundOff: number
  totalAmount: number

  status: InvoiceStatus

  financialYearId?: string | null
  financialYear?: FinancialYear | null

  createdAt: string

  items?: InvoiceItem[]
  chalans?: Chalan[]
}

export type InvoiceItem = {
  id: string

  invoiceId: string

  description: string
  subdescription: string[]

  hsnCode?: string | null
  unit?: string | null

  quantity: number
  rate: number
  amount: number
}

//////////////////////////////////////////////////////
//////////////////// CHALAN //////////////////////////
//////////////////////////////////////////////////////

export type Chalan = {
  id: string

  invoiceId?: string | null
  invoice?: Invoice | null

  partyId: string
  party?: Party

  shipToId?: string | null
  shipTo?: Party | null

  chNo: string
  vehicleNo?: string | null

  issueDate: string

  month?: number | null
  year?: number | null

  status: InvoiceStatus

  items?: ChalanItem[]
}

export type ChalanItem = {
  id: string

  chalanId: string

  description: string
  subdescription: string[]

  hsnCode?: string | null
  unit?: string | null

  quantity: number
  weight?: number | null
}

//////////////////////////////////////////////////////
//////////////////// PAYMENTS ////////////////////////
//////////////////////////////////////////////////////

export type Payment = {
  id: string

  partyId: string
  party?: Party

  partyType: PartyType

  amount: number

  method?: string | null
  note?: string | null

  paymentDate: string

  createdAt: string

  ledgerEntries?: LedgerEntry[]
}

//////////////////////////////////////////////////////
//////////////////// LEDGER //////////////////////////
//////////////////////////////////////////////////////

export type LedgerEntry = {
  id: string

  partyId: string
  party?: Party

  year: number
  month: number

  referenceType: LedgerReferenceType
  referenceId?: string | null

  description?: string | null

  debit: number
  credit: number

  date: string

  paymentId?: string | null
  payment?: Payment | null

  createdAt: string
}
*/
