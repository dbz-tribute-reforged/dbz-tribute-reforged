import { Id } from "Common/Constants";
import { HeroSelectCategory } from "./HeroSelectCategory";


const emptySpace = {
  unitCode: 0,
  onlyRandom: false,
  requirement: null,
  category: 0
};

const gokuData = {
  unitCode: Id.goku,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.AGI + 
    HeroSelectCategory.INT + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.ASSASSIN +
    HeroSelectCategory.CARRY
  )
}
const vegetaData = {
  unitCode: Id.vegeta,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.STR + 
    HeroSelectCategory.INT + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.BRUISER +
    HeroSelectCategory.BEAMER +
    HeroSelectCategory.CARRY
  )
}
const gohanData = {
  unitCode: Id.gohan,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.INT + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.BEAMER +
    HeroSelectCategory.CARRY
  )
}
const gotenksData = {
  unitCode: Id.goten,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.INT + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.BEAMER +
    HeroSelectCategory.SUPPORT +
    HeroSelectCategory.MICRO
  )
}
const futureTrunksData = {
  unitCode: Id.ft,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.STR + 
    HeroSelectCategory.INT + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.BRUISER
  )
}
const piccoloData = {
  unitCode: Id.piccolo,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.STR + 
    HeroSelectCategory.INT + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.BRUISER +
    HeroSelectCategory.MICRO
  )
}
const bardockData = {
  unitCode: Id.bardock,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.AGI + 
    HeroSelectCategory.INT + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.ASSASSIN
  )
}
const panData = {
  unitCode: Id.pan,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.INT + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.BEAMER
  )
}
const farmerData = {
  unitCode: Id.farmerWithShotgun,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.INT + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.MEME + 
    HeroSelectCategory.BEAMER + 
    HeroSelectCategory.SUPPORT + 
    HeroSelectCategory.MICRO
  )
}
const android17DbsData = {
  unitCode: Id.android17dbs,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.INT + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.BEAMER + 
    HeroSelectCategory.SUPPORT
  )
}
const videlData = {
  unitCode: Id.videl,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.STR + 
    HeroSelectCategory.AGI + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.BRUISER
  )
}
const roshiData = {
  unitCode: Id.roshi,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.INT + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.BEAMER
  )
}
const krillinData = {
  unitCode: Id.krillin,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.INT + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.BEAMER + 
    HeroSelectCategory.SUPPORT
  )
}
const tienData = {
  unitCode: Id.tien,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.STR + 
    HeroSelectCategory.INT + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.BRUISER + 
    HeroSelectCategory.BEAMER + 
    HeroSelectCategory.MICRO
  )
}
const yamchaRData = {
  unitCode: Id.yamchaR,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.STR + 
    HeroSelectCategory.AGI + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.MEME + 
    HeroSelectCategory.BRUISER + 
    HeroSelectCategory.ASSASSIN + 
    HeroSelectCategory.BEAMER + 
    HeroSelectCategory.MICRO
  )
}
const upaData = {
  unitCode: Id.upa,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.STR + 
    HeroSelectCategory.INT + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.BRUISER
  )
}
const tapionData = {
  unitCode: Id.tapion,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.AGI + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.BRUISER + 
    HeroSelectCategory.CARRY
  )
}
const toppoData = {
  unitCode: Id.toppo,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.AGI + 
    HeroSelectCategory.INT + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.BRUISER + 
    HeroSelectCategory.CARRY +
    HeroSelectCategory.SUPPORT
  )
}
const dyspoData = {
  unitCode: Id.dyspo,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.AGI +
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.ASSASSIN
  )
}
const jirenData = {
  unitCode: Id.jiren,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.STR +
    HeroSelectCategory.INT +
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.BRUISER +
    HeroSelectCategory.CARRY
  )
}
const jacoData = {
  unitCode: Id.jaco,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.AGI +
    HeroSelectCategory.INT +
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.ASSASSIN +
    HeroSelectCategory.CARRY
  )
}
const dendeData = {
  unitCode: Id.dende,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.INT +
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.BEAMER +
    HeroSelectCategory.SUPPORT
  )
}
const android13Data = {
  unitCode: Id.android13,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.STR + 
    HeroSelectCategory.INT + 
    HeroSelectCategory.EVIL + 
    HeroSelectCategory.BRUISER +
    HeroSelectCategory.MICRO
  )
}
const babidiData = {
  unitCode: Id.babidi,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.INT + 
    HeroSelectCategory.EVIL + 
    HeroSelectCategory.BEAMER +
    HeroSelectCategory.MICRO
  )
}
const fatBuuData = {
  unitCode: Id.fatBuu,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.INT + 
    HeroSelectCategory.EVIL + 
    HeroSelectCategory.BRUISER +
    HeroSelectCategory.CARRY
  )
}
const brolyData = {
  unitCode: Id.broly,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.STR + 
    HeroSelectCategory.EVIL + 
    HeroSelectCategory.BRUISER
  )
}
const cellData = {
  unitCode: Id.cellUnformed,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.INT + 
    HeroSelectCategory.EVIL + 
    HeroSelectCategory.BEAMER +
    HeroSelectCategory.CARRY +
    HeroSelectCategory.MICRO
  )
}
const cellMaxData = {
  unitCode: Id.cellMax,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.STR + 
    HeroSelectCategory.EVIL + 
    HeroSelectCategory.BRUISER
  )
}
const coolerData = {
  unitCode: Id.fourthCooler,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.AGI + 
    HeroSelectCategory.INT + 
    HeroSelectCategory.EVIL + 
    HeroSelectCategory.ASSASSIN +
    HeroSelectCategory.CARRY
  )
}
const getiStarData = {
  unitCode: Id.getiStarHero,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.INT + 
    HeroSelectCategory.EVIL + 
    HeroSelectCategory.BEAMER + 
    HeroSelectCategory.CARRY + 
    HeroSelectCategory.MICRO
  )
}
const janembaData = {
  unitCode: Id.janemba,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.STR + 
    HeroSelectCategory.AGI + 
    HeroSelectCategory.EVIL + 
    HeroSelectCategory.ASSASSIN +
    HeroSelectCategory.CARRY
  )
}
const hirudegarnData = {
  unitCode: Id.hirudegarn,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.STR + 
    HeroSelectCategory.INT + 
    HeroSelectCategory.EVIL + 
    HeroSelectCategory.BRUISER
  )
}
const super17Data = {
  unitCode: Id.super17,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.STR + 
    HeroSelectCategory.INT + 
    HeroSelectCategory.EVIL + 
    HeroSelectCategory.BEAMER
  )
}
const zamasuData = {
  unitCode: Id.zamasu,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.AGI + 
    HeroSelectCategory.INT + 
    HeroSelectCategory.EVIL + 
    HeroSelectCategory.ASSASSIN +
    HeroSelectCategory.CARRY
  )
}
const gokuBlackData = {
  unitCode: Id.gokuBlack,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.AGI + 
    HeroSelectCategory.INT + 
    HeroSelectCategory.EVIL + 
    HeroSelectCategory.ASSASSIN +
    HeroSelectCategory.CARRY
  )
}
const omegaShenronData = {
  unitCode: Id.omegaShenron,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.STR + 
    HeroSelectCategory.AGI + 
    HeroSelectCategory.INT + 
    HeroSelectCategory.EVIL + 
    HeroSelectCategory.ASSASSIN + 
    HeroSelectCategory.CARRY
  )
}
const eisShenronData = {
  unitCode: Id.eisShenron,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.AGI + 
    HeroSelectCategory.EVIL + 
    HeroSelectCategory.BRUISER
  )
}
const friezaData = {
  unitCode: Id.frieza,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.AGI + 
    HeroSelectCategory.INT + 
    HeroSelectCategory.EVIL + 
    HeroSelectCategory.BEAMER +
    HeroSelectCategory.CARRY
  )
}
const ginyuData = {
  unitCode: Id.ginyu,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.INT + 
    HeroSelectCategory.EVIL + 
    HeroSelectCategory.MEME + 
    HeroSelectCategory.BEAMER +
    HeroSelectCategory.SUPPORT
  )
}
const guldoData = {
  unitCode: Id.guldo,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.INT + 
    HeroSelectCategory.EVIL + 
    HeroSelectCategory.BEAMER +
    HeroSelectCategory.SUPPORT
  )
}
const appuleData = {
  unitCode: Id.appule,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.AGI + 
    HeroSelectCategory.INT + 
    HeroSelectCategory.EVIL + 
    HeroSelectCategory.MEME + 
    HeroSelectCategory.ASSASSIN +
    HeroSelectCategory.CARRY +
    HeroSelectCategory.MICRO  
  )
}
const raditzData = {
  unitCode: Id.raditz,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.STR + 
    HeroSelectCategory.INT + 
    HeroSelectCategory.EVIL + 
    HeroSelectCategory.BEAMER
  )
}
const nappaData = {
  unitCode: Id.nappa,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.STR + 
    HeroSelectCategory.INT + 
    HeroSelectCategory.EVIL + 
    HeroSelectCategory.BEAMER +
    HeroSelectCategory.MICRO
  )
}
const hitData = {
  unitCode: Id.hit,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.AGI +
    HeroSelectCategory.INT +
    HeroSelectCategory.EVIL + 
    HeroSelectCategory.ASSASSIN
  )
}
const moroData = {
  unitCode: Id.moro,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.INT + 
    HeroSelectCategory.EVIL + 
    HeroSelectCategory.BEAMER + 
    HeroSelectCategory.SUPPORT
  )
}
const cronoData = {
  unitCode: Id.crono,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.AGI + 
    HeroSelectCategory.INT + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.CRONO + 
    HeroSelectCategory.ASSASSIN +
    HeroSelectCategory.CARRY
  )
}
const frogData = {
  unitCode: Id.frog,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.STR + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.CRONO + 
    HeroSelectCategory.BRUISER +
    HeroSelectCategory.CARRY
  )
}
const roboData = {
  unitCode: Id.robo,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.STR + 
    HeroSelectCategory.INT + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.CRONO + 
    HeroSelectCategory.BRUISER
  )
}
const magusData = {
  unitCode: Id.magus,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.INT + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.EVIL + 
    HeroSelectCategory.CRONO + 
    HeroSelectCategory.BEAMER +
    HeroSelectCategory.SUPPORT
  )
}
const luccaData = {
  unitCode: Id.lucca,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.INT + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.CRONO + 
    HeroSelectCategory.BEAMER +
    HeroSelectCategory.CARRY
  )
}
const aylaData = {
  unitCode: Id.ayla,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.AGI + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.CRONO + 
    HeroSelectCategory.BRUISER +
    HeroSelectCategory.ASSASSIN
  )
}
const marleData = {
  unitCode: Id.marle,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.INT + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.CRONO + 
    HeroSelectCategory.BEAMER +
    HeroSelectCategory.SUPPORT
  )
}
const schalaData = {
  unitCode: Id.schala,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.INT + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.CRONO + 
    HeroSelectCategory.BEAMER +
    HeroSelectCategory.CARRY +
    HeroSelectCategory.SUPPORT
  )
}
const donkeyKongData = {
  unitCode: Id.donkeyKong,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.STR + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.MEME + 
    HeroSelectCategory.BRUISER
  )
}
const kkrData = {
  unitCode: Id.kkr,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.STR + 
    HeroSelectCategory.EVIL + 
    HeroSelectCategory.MEME + 
    HeroSelectCategory.BRUISER
  )
}
const skurvyData = {
  unitCode: Id.skurvy,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.STR + 
    HeroSelectCategory.AGI + 
    HeroSelectCategory.EVIL + 
    HeroSelectCategory.MEME + 
    HeroSelectCategory.ASSASSIN
  )
}
const saitamaData = {
  unitCode: Id.saitama,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.STR + 
    HeroSelectCategory.AGI + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.MEME + 
    HeroSelectCategory.BRUISER
  )
}
const ichigoData = {
  unitCode: Id.ichigo,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.AGI + 
    HeroSelectCategory.INT + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.MEME + 
    HeroSelectCategory.BRUISER +
    HeroSelectCategory.ASSASSIN +
    HeroSelectCategory.CARRY
  )
}
const gutsData = {
  unitCode: Id.guts,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.STR + 
    HeroSelectCategory.AGI + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.MEME + 
    HeroSelectCategory.BRUISER +
    HeroSelectCategory.CARRY
  )
}
const allMightData = {
  unitCode: Id.allMight,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.STR + 
    HeroSelectCategory.AGI + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.MEME + 
    HeroSelectCategory.BRUISER
  )
}
const shotoTodorokiData = {
  unitCode: Id.shotoTodoroki,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.INT + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.MEME + 
    HeroSelectCategory.ASSASSIN + 
    HeroSelectCategory.BEAMER
  )
}
const meguminData = {
  unitCode: Id.megumin,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.INT + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.MEME + 
    HeroSelectCategory.BEAMER
  )
}
const pecorineData = {
  unitCode: Id.pecorine,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.STR + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.MEME + 
    HeroSelectCategory.BRUISER
  )
}
const lucarioData = {
  unitCode: Id.lucario,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.STR + 
    HeroSelectCategory.INT + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.MEME + 
    HeroSelectCategory.BRUISER + 
    HeroSelectCategory.ASSASSIN + 
    HeroSelectCategory.CARRY
  )
}
const sephirothData = {
  unitCode: Id.sephiroth,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.AGI + 
    HeroSelectCategory.INT + 
    HeroSelectCategory.EVIL + 
    HeroSelectCategory.MEME + 
    HeroSelectCategory.ASSASSIN + 
    HeroSelectCategory.CARRY
  )
}
const dartFeldData = {
  unitCode: Id.dartFeld,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.STR + 
    HeroSelectCategory.INT + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.MEME + 
    HeroSelectCategory.BRUISER
  )
}
const leonSKennedyData = {
  unitCode: Id.leonSKennedy,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.AGI + 
    HeroSelectCategory.INT + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.MEME + 
    HeroSelectCategory.ASSASSIN +
    HeroSelectCategory.BEAMER
  )
}
const marioData = {
  unitCode: Id.mario,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.STR + 
    HeroSelectCategory.AGI + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.MEME + 
    HeroSelectCategory.BRUISER
  )
}
const waluigiData = {
  unitCode: Id.waluigi,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.AGI + 
    HeroSelectCategory.INT + 
    HeroSelectCategory.EVIL + 
    HeroSelectCategory.MEME + 
    HeroSelectCategory.BEAMER +
    HeroSelectCategory.SUPPORT
  )
}
const sonicData = {
  unitCode: Id.sonic,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.AGI + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.MEME + 
    HeroSelectCategory.ASSASSIN
  )
}
const linkTwilightData = {
  unitCode: Id.linkTwilight,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.INT + 
    HeroSelectCategory.GOOD + 
    HeroSelectCategory.MEME + 
    HeroSelectCategory.BEAMER
  )
}
const ainzData = {
  unitCode: Id.ainzOoalGown,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.AGI + 
    HeroSelectCategory.INT + 
    HeroSelectCategory.EVIL + 
    HeroSelectCategory.MEME + 
    HeroSelectCategory.BEAMER
  )
}
const rustyData = {
  unitCode: Id.rustTyranno,
  onlyRandom: false,
  requirement: null,
  category: (
    HeroSelectCategory.STR + 
    HeroSelectCategory.INT + 
    HeroSelectCategory.EVIL + 
    HeroSelectCategory.CRONO + 
    HeroSelectCategory.MEME + 
    HeroSelectCategory.BRUISER
  )
}


// order matters
export const HeroSelectUnitList = [
  gokuData,
  vegetaData,
  gohanData,
  gotenksData,
  futureTrunksData,
  // 5,
  piccoloData,
  bardockData,
  panData,
  videlData,
  android17DbsData,
  // 10
  roshiData,
  krillinData,
  tienData,
  farmerData,
  emptySpace,
  // yamchaRData,

  // ====
  // 15
  // ====
  upaData,
  tapionData,
  toppoData,
  jirenData,
  dyspoData,
  // 20
  jacoData,
  dendeData,
  emptySpace,
  emptySpace,
  emptySpace,
  // 25
  emptySpace,
  emptySpace,
  emptySpace,
  emptySpace,
  emptySpace,

  // ====
  // 30
  // ====

  android13Data,
  babidiData,
  fatBuuData,
  brolyData,
  cellData,
  // 35
  cellMaxData,
  coolerData,
  getiStarData,
  janembaData,
  super17Data,
  // 40
  hirudegarnData,
  omegaShenronData,
  eisShenronData,
  emptySpace,
  emptySpace,

  // ====
  // 45
  // ====

  friezaData,
  ginyuData,
  guldoData,
  appuleData,
  raditzData,
  // 50
  nappaData,
  zamasuData,
  gokuBlackData,
  hitData,
  moroData,
  // 55
  emptySpace,
  emptySpace,
  emptySpace,
  emptySpace,
  emptySpace,

  // ====
  // 60
  // ====

  cronoData,
  frogData,
  roboData,
  magusData,
  luccaData,
  // 65
  aylaData,
  marleData,
  schalaData,
  rustyData,
  emptySpace,
  // 70
  emptySpace,
  emptySpace,
  donkeyKongData,
  kkrData,
  skurvyData,

  // ====
  // 75
  // ====

  saitamaData,
  ichigoData,
  gutsData,
  allMightData,
  shotoTodorokiData,
  // 80
  meguminData,
  pecorineData,
  lucarioData,
  sephirothData,
  dartFeldData,
  // 85
  leonSKennedyData,
  marioData,
  waluigiData,
  sonicData,
  linkTwilightData,

  // 90
  ainzData,
  emptySpace,
  emptySpace,
  emptySpace,
  emptySpace,
  // 95
  emptySpace,
  emptySpace,
  emptySpace,
  emptySpace,
  emptySpace,
  // 100
  emptySpace,
  emptySpace,
  emptySpace,
  emptySpace,
  emptySpace,
];