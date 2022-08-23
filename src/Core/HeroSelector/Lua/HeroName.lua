HeroName = {
  -- unitCode = "name"
  H000 = "Goku",
  E003 = "Vegeta",
  H00K = "Gohan",
  H008 = "Gotenks",
  H009 = "Future Trunks",
  H00R = "Piccolo",
  H08M = "Bardock",
  H08P = "Pan",
  H08S = "Farmer with Shotgun",
  H08Z = "Android 17 (DB Super)",
  H085 = "Videl",
  E001 = "Master Roshi",
  H03Y = "Krillin",
  H055 = "Tien",
  E010 = "Yamcha (Reforged)",
  H099 = "Upa",
  E014 = "Tapion",
  H09C = "Toppo",
  H09H = "Dyspo",
  E01P = "Jiren",
  H0AL = "Jaco",

  H01V = "Android 13",
  O001 = "Babidi",
  O005 = "Majin Buu",
  H00M = "Broly (DB Super)",
  N00Q = "Cell",
  H042 = "Cooler (Fourth)",
  H08U = "Raditz",
  H08W = "Nappa",
  H062 = "Super Janemba",
  H05U = "Hirudegarn",
  H05V = "Super 17 (GT)",
  E012 = "Zamasu",
  H08Y = "Moro",
  H09F = "Omega Shenron",
  H09B = "Eis Shenron",
  H06X = "Frieza",
  H09E = "Captain Ginyu",
  H09J = "Guldo",
  H0AI = "Appule",
  E00K = "Hit",

  H0A0 = "Crono",
  H0A1 = "Frog",
  H0A2 = "Robo",
  H0A3 = "Magus",
  H0A4 = "Lucca",
  H0A5 = "Ayla",
  H0A6 = "Marle",
  H05W = "Schala",
  
  H05Q = "Donkey Kong",
  E01D = "King K. Rool",
  H07Y = "Skurvy",

  H04Y = "Saitama",
  H09S = "Ichigo",
  H09K = "All Might",
  H05X = "Shoto Todoroki",
  H0A7 = "Lucario",
  H09M = "Sephiroth",
  H09Y = "Dart Feld",
  H09Q = "Mario",
  H0AA = "Sonic (Sega Mega)",

  H09Z = "Rust Tyranno (Secret)"
}

function hNameGetFourCC(num)
    return string.pack(">I4", num)
end

function getHeroName(unitCode)
    if HeroName[unitCode] then
        return HeroName[unitCode]
    end
    local code = hNameGetFourCC(unitCode)
    if HeroName[code] then
        return HeroName[code]
    end
    return GetObjectName(unitCode)
end
