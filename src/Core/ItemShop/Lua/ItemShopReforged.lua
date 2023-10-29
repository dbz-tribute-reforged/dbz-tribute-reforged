--[[ TasItemShopV4g by Tasyen
ItemShop.TasItemSetCategory(itemCode, category)
ItemShop.TasItemShopAdd(itemCode, category)
ItemShop.TasItemShopAddCategory(icon, text)
 define a new Category, should be done before the UI is created.
 Returns the value of the new category
ItemShop.TasItemShopUIShow(player, shop, shopperGroup[, mainShoper])
    ItemShop.TasItemShopUIShow(player) hides the shop for player
    shopperGroup are all units providing items, if you use nil the current shoppergroup remains intact. When giving something else the group contains only mainShoper.
    mainShoper is the unit consider for haggel and gains the items. If you gave a group then you can skip mainShoper then a random is taken.
    with player and shop the shoppers are kept but the shop updates.
    Beaware that this System does only update on user input it will not check distance/live or anything.
ItemShop.TasItemShopUIShowSimple(player, shop, mainShoper)
ItemShop.TasItemShopCreateShop(unitCode, whiteList, goldFactor, lumberFactor, goldFunction, lumberFunction)
ItemShop.TasItemShopAddShop(unitCode, ...)
 adds data for that specific shop
TasItemShopGoldFactor(unitCode, factor, ...)
    sets the goldFactor for that shop to the given data
TasItemShopLumberFactor(unitCode, factor, ...)
    lumberFactor ^^
ItemShop.TasItemShopAddHaggleSkill(skill, goldBase[, lumberBase, goldAdd, lumberAdd])
    adds a new Skill which will affect the costs in TasItemShop.
TasItemShopUI.SetQuickLink(player, itemCode)
    add/remove itemCode from quickLink for player
TasItemShopUI.ClearQuickLink(player)
--]]
TasItemShopUI = {
    TempTable =  {},
    QuickLinkKeyActive = __jarray(false),
    Undo = {},
    Shops = {},
    Frames = {},
    Selected = __jarray(0),
    SelectedCategory = 0,
    SelectedItem = {},
    MarkedItemCodes = {},
    QuickLink = {},
    Categories = {
        Value = __jarray(0),
        -- should only have 31 or less
        -- it is more practically to use function ItemShop.TasItemShopAddCategory(icon, text) inside UserInit()
        -- Icon path, tooltip Text (tries to localize)
    }
}

ItemShop = {}
-- A list of items buyable, you could just smack in all your buyAble TasItems here.
-- Or use ItemShop.TasItemShopAdd(itemCode, category) inside local function UserInit()
-- This List is used by shops without custom data or by BlackList Shops
ItemShop.BUY_ABLE_ITEMS = {
    'bgst', 'ciri', 'belv', 'hval', 'hcun', 'mcou', 'ckng', 'rat9', 'ratf', 'rst1', 'rin1', 'rag1', 'cnob', 'rat6', 'rlif'
    ,'ajen', 'clfm', 'ward', 'kpin', 'lgdh', 'rde4', 'pmna', 'rhth', 'ssil', 'spsh', 'lhst', 'afac', 'sbch', 'brac', 'rwiz', 'crys', 'evtl', 'penr'
    ,'prvt', 'rde3', 'bspd', 'gcel', 'rde2', 'clsd', 'dsum', 'stel', 'desc', 'modt', 'ofro', 'thdm', 'hlst', 'mnst', 'pghe', 'pgma', 'pnvu', 'pres'
    ,'ankh', 'shas', 'stwp', 'ofir', 'oli2', 'odef', 'oven', 'oslo', 'ocor', 'shtm', 'I001', 'klmm', 'crdt'
}
ItemShop.BUY_ABLE_ITEMS = {
    -- skill, GoldBase, Lumberbase, GoldAdd, LumberAdd
    -- add is added per Level of that skill to Base. The current Cost is than multiplied by that Factor.
    --{FourCC('A000'), 0.8, 0.8, 0.0, 0.0}
}

-- position of the custom UI
-- it can leave the 4:3 Screen but you should checkout the start of function TasItemShopUI.Create
ItemShop.xPos = 0.0
ItemShop.yPos = -0.02
ItemShop.posPoint = FRAMEPOINT_TOP
ItemShop.posScreenRelative = false --(true) repos to the screenSize, when the resolution mode changes the box will move further in/out when using a right or Left point.
-- It is advised to ItemShop.posScreenRelative = false when ItemShop.posPoint does not include Left or Right
-- with ItemShop.posScreenRelative = false ItemShop.xPos and ItemShop.yPos are abs coords, to which ItemShop.posPoint of the Shop UI is placed to.

-- position of Item toolTips, this does not affect the tooltips for Categories or Users.
-- comment out ItemShop.toolTipPosPointParent, if you want a specific position on screen.
-- with ItemShop.toolTipPosPoint & ItemShop.toolTipPosPointParent are ItemShop.toolTipPosX & ItemShop.toolTipPosX relative offsets.
-- The position is a bit wierd, the position is not the box but the Extended Tooltip Text, the Header has a height of ~0.052.
ItemShop.toolTipPosX = 0.0
ItemShop.toolTipPosX = -0.052
ItemShop.toolTipPosPoint = FRAMEPOINT_TOPRIGHT
ItemShop.toolTipPosPointParent = FRAMEPOINT_BOTTOMRIGHT
ItemShop.toolTipSizeX = 0.2 -- only content
ItemShop.toolTipSizeXBig = 0.3 -- only content
ItemShop.toolTipLimitBig = 300 -- When a TooltipText Contains this amount or more of Chars it will use ItemShop.toolTipSizeXBig

-- this can be used to change the visual ("EscMenuControlBackdropTemplate") ("TasItemShopRaceBackdrop")
ItemShop.boxFrameName = "TasItemShopRaceBackdrop"
ItemShop.boxButtonListFrameName = "EscMenuControlBackdropTemplate"
ItemShop.boxRefFrameName = "EscMenuControlBackdropTemplate"
ItemShop.boxCatFrameName = "EscMenuControlBackdropTemplate"
ItemShop.boxUndoFrameName = "TasItemShopRaceBackdrop"
ItemShop.boxDefuseFrameName = "TasItemShopRaceBackdrop"
ItemShop.buttonListHighLightFrameName = "TasItemShopSelectedHighlight"
ItemShop.boxFrameBorderGap = 0.0065
ItemShop.boxButtonListBorderGap = 0.0065 -- does nothing right now
ItemShop.boxRefBorderGap = 0.0065
ItemShop.boxCatBorderGap = 0.0055
ItemShop.boxUndoBorderGap = 0.0045
ItemShop.boxDefuseBorderGap = 0.0045
ItemShop.boxSellBorderGap = 0.0045
ItemShop.buttonListButtonGapCol = 0.001
ItemShop.buttonListButtonGapRow = 0.005
-- material control
ItemShop.flexibleShop = false -- (true) can sell items not added to the shop. This includes items reached over RefButtons and material for autocompletion. I don't know that item, but your description is enough. I craft it, no problem.
ItemShop.sharedItems = false -- (false) can only fuse material owned by neutral passive (default) or oneself. The code handling that is in TasItemFusion.
ItemShop.canProviderGetItem = true -- (true) when the mainShopper's inventory is full, try to give the other matieral provider the item
ItemShop.canUndo = true -- (true) There is an Undo Button which allows to Revert BuyActions done in this shopping. A shopping ends when the UI is closed, changing current shop counts as closed.
ItemShop.canDefuse = true -- (true) There is a Defuse Button which allows to defuse FusionItems hold.
ItemShop.DefuseButtonIcon = "ReplaceableTextures\\CommandButtons\\BTNdemolish"
ItemShop.DefuseButtonIconDisabled = getDisabledIcon(ItemShop.DefuseButtonIcon)
ItemShop.canSellItems = true -- (true)
ItemShop.SellFactor = 0.75
ItemShop.SellUsesCostModifier = true
ItemShop.SellButtonIcon = "ReplaceableTextures\\CommandButtons\\BTNReturnGoods"
ItemShop.SellButtonIconDisabled = getDisabledIcon(ItemShop.SellButtonIcon)

ItemShop.MainUserTexture = "ui\\widgets\\console\\human\\commandbutton\\human-multipleselection-border" 
ItemShop.MainItemTexture = "ui\\widgets\\console\\human\\commandbutton\\human-multipleselection-border" 

ItemShop.shopRange = 1200 -- the max distance between shop and ItemShop.Shoper, this can be overwritten by shopObject.Range.
ItemShop.updateTime = 0.4 -- how many seconds pass before a new update is applied. update: search new shopers, validat current shopers and update UI.
-- Titel-text in the reference Boxes
ItemShop.textUpgrades = "COLON_UPGRADE" --tries to localize on creation
ItemShop.textMats = "SCORESCREEN_TAB3"
ItemShop.textInventory = "INVENTORY"
ItemShop.textUser = "USER"
ItemShop.textCanNotBuyPrefix = "Can not buy: "
ItemShop.textCanNotBuySufix = "OUTOFSTOCKTOOLTIP"
ItemShop.textNoValidShopper = "No valid ItemShop.Shoper"
ItemShop.textUndo = "Undo: "
ItemShop.textUnBuyable = "xxxxxxx"
ItemShop.textDefuse = "Defuse:"
ItemShop.textSell = "Sell:"
ItemShop.textQuickLink = "ShortCuts:"
ItemShop.categoryModeTextAnd = "ui\\widgets\\battlenet\\bnet-mainmenu-friends-disabled"
ItemShop.categoryModeTextOr = "Or"
ItemShop.categoryModeIconOr = "ui\\widgets\\battlenet\\bnet-mainmenu-friends-up"
ItemShop.categoryModeIconAnd = "And"

ItemShop.quickLinkKey = OSKEY_LSHIFT  -- nil will prevent the user from changing shortcuts. can also be commented out
-- how many refButtons, refButtons have pages, if needed.
-- A feature is disabled with a counter smaller than 1.
ItemShop.refButtonCountMats = 4 -- materialRefs.
ItemShop.refButtonCountUp = 4 -- possible upgrades of the current Selected
ItemShop.refButtonCountInv = 6 -- inventory items, this system allows an unitgroup to provide items, if you don't use that feature only upto 6 makes sense.
ItemShop.refButtonCountUser = 6 -- References to the shopping Units/material provider.
ItemShop.refButtonCountQuickLink = 4 -- User SelectAble Shortcuts
ItemShop.refButtonSize = 0.02
ItemShop.refButtonGap = 0.003
ItemShop.refButtonPageSize = 0.012
ItemShop.refButtonPageRotate = true --(true) swap to first page when going above last page, and swap to last page when going down first Page
ItemShop.refButtonPageUp = "ReplaceableTextures\\CommandButtons\\BTNReplay-SpeedUp"
ItemShop.refButtonPageDown = "ReplaceableTextures\\CommandButtons\\BTNReplay-SpeedDown"
ItemShop.refButtonBoxSizeY = 0.047

-- ItemShop.LayoutType alters the position of buttons
-- (0) the buy button is at the bottom between buttonList and buybutton the refBoxes are placed  
-- (1) the buy button is below the buttonList below it are the refButtons
-- (2) the buy button is below the buttonList, the RefButtons are at the bottom outside of the Box
-- (3) the buy button is below the buttonList, the RefButtons are left outside of the Box they are also from top to bottom
ItemShop.LayoutType = 0

-- (true) right clicking an refInventoryButton in the UI will sell the item
-- (false) right clicking it will buy it again.
ItemShop.inventoryRightClickSell = true
ItemShop.inventoryShowMainOnly = true --(false) show all items currently useable

ItemShop.userButtonOrder = false -- (true) Creates any UnitTargetOrder Event enables right clicking Units in the world to swap main shoppers.
ItemShop.doubleClickTimeOut = 2.0 -- amount of seconds a doppleclick inside the Buttonlist counts as Buying    

-- model displayed when buy request was started.
--ItemShop.spriteModel = "UI\\Feedback\\GoldCredit\\GoldCredit.mdl" -- in 1.31 the coins are black only.
--ItemShop.spriteModel = "Abilities\\Weapons\\RockBoltMissile\\RockBoltMissile.mdl"
--ItemShop.spriteModel = "Abilities\\Weapons\\BansheeMissile\\BansheeMissile.mdl"
--ItemShop.spriteModel = "Abilities\\Spells\\Other\\GeneralAuraTarget\\GeneralAuraTarget.mdl"
ItemShop.spriteModel = "war3mapImported\\BansheeMissile.mdx" --by abfal, (no sound).
ItemShop.spriteScale = 0.0006 -- The scale has to fit the used model. if you use non-UI models use a low scale, 0.001 or below.
ItemShop.spriteAnimationIndex = 1 -- 1 = death animation

ItemShop.buttonListRows = 5
-- ItemShop.buttonListCols has a strong impact on the ItemShop.xSize of this UI. make sure that refButtons of one type fit into this.
ItemShop.buttonListCols = 3

-- this will not change the size of the Buttons, nor the space the text can take
-- true = Show
-- false = hide
ItemShop.buttonListShowGold = true
ItemShop.buttonListShowLumber = true
ItemShop.buyButtonShowGold = true
ItemShop.buyButtonShowLumber = true

-- which button is used inside the ButtonList? Enable one block and disable the other one

ItemShop.buttonListButtonName = "TasButtonSmall"
ItemShop.buttonListButtonSizeX = 0.1
ItemShop.buttonListButtonSizeY = 0.0325

-- "TasButtonGrid" are smaller, they don't show the names in the list
--ItemShop.buttonListButtonName = "TasButtonGrid"
--ItemShop.buttonListButtonSizeX = 0.064
--ItemShop.buttonListButtonSizeY = 0.0265

--ItemShop.buttonListButtonName = "TasButton"
--ItemShop.buttonListButtonSizeX = 0.2
--ItemShop.buttonListButtonSizeY = 0.0265

ItemShop.categoryButtonSize = 0.019

--
-- system start, touch on your own concern
--
-- the unique power2 Values used for categories, shifted by 1
ItemShop.CategoryValue = {1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768,65536,131072,262144,524288,1048576,2097152,4194304,8388608,16777216,33554432,67108864,134217728,268435456,536870912,1073741824}

ItemShop.TasItemCategory = __jarray(0)

ItemShop.TasItemShopCreateShopSimple = ItemShop.TasItemShopCreateShop

ItemShop.Shoper = {}
ItemShop.DoubleClickStamp = 0
ItemShop.ShoperMain = {}
ItemShop.CurrentShop = {}
ItemShop.LocalShopObject = {}
ItemShop.CurrentOffSetInventory = __jarray(0)
ItemShop.CurrentOffSetMaterial = __jarray(0)
ItemShop.CurrentOffSetUpgrade = __jarray(0)
ItemShop.CurrentOffSetUser = __jarray(0)
ItemShop.CurrentOffSetQuickLink = __jarray(0)
ItemShop.xSize = 0 -- Size of the total Box
ItemShop.ySize = 0 -- this is autocalced

ItemShop.FusionAdd = TasItemFusionAdd


-- This runs right before the actually UI is created.
-- this is a good place to add items, categories, fusions shops etc.
function UserInit()
    -- this can all be done in GUI aswell, enable the next Line or remove all Text of this function if you only want to use GUI
    --if true then return end

    -- define Categories: Icon, Text
    -- the Categories are displayed in the order added.
    -- it is a good idea to save the returned Value in a local to make the category setup later much easier to understand.
    -- you can only have 31 categories
    local catDmg = ItemShop.TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNSteelMelee", "COLON_DAMAGE")
    local catArmor = ItemShop.TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNHumanArmorUpOne", "COLON_ARMOR")
    local catStr = ItemShop.TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNGauntletsOfOgrePower", "STRENGTH")
    local catAgi = ItemShop.TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNSlippersOfAgility", "AGILITY")
    local catInt = ItemShop.TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNMantleOfIntelligence", "INTELLECT")
    local catLife = ItemShop.TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNPeriapt", "Life")
    local catLifeReg = ItemShop.TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNRegenerate", "LifeRegeneration")
    local catMana = ItemShop.TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNPendantOfMana", "Mana")
    local catManaReg = ItemShop.TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNSobiMask", "ManaRegeneration")
    local catOrb = ItemShop.TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNOrbOfDarkness", "Orb")
    local catAura = ItemShop.TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNLionHorn", "Aura")
    local catActive = ItemShop.TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNStaffOfSilence", "Active")
    local catPower = ItemShop.TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNControlMagic", "SpellPower")
    local catCooldown = ItemShop.TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNHumanMissileUpOne", "Cooldown")
    local catAtkSpeed = ItemShop.TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNHumanMissileUpOne", "Attackspeed")
    local catMress = ItemShop.TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNRunedBracers", "Magic-Resistence")
    local catConsum = ItemShop.TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNPotionGreenSmall", "ConsumAble")
    local catMoveSpeed = ItemShop.TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNBootsOfSpeed", "COLON_MOVE_SPEED")
    local catCrit = ItemShop.TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNCriticalStrike", "Crit")
    local catLifeSteal = ItemShop.TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNVampiricAura", "Lifesteal")
    local catEvade = ItemShop.TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNEvasion", "Evasion")

    -- setup custom shops
    -- custom Shops are optional.
    -- They can have a White or Blacklist of items they can(n't) sell and have a fixed cost modifier for Gold, Lumber aswell as a function for more dynamic things for Gold and Lumber.
    -- local shopObject
    -- 'n000' can only sell this items (this items don't have to be in the pool of items)
    shopObject = ItemShop.TasItemShopAddShop('n01P', 'hlst', 'mnst', 'pghe', 'pgma', 'pnvu', 'pres', 'ankh', 'stwp', 'shas', 'I004', 'I006')
    -- -- enable WhiteListMode
    -- shopObject.Mode = true
    -- -- 'n001' can't sell this items (from the default pool of items)
    -- shopObject = ItemShop.TasItemShopAddShop('n001', 'hlst', 'mnst', 'pghe', 'pgma', 'pnvu', 'pres', 'ankh', 'stwp', 'shas')
    -- -- enable BlackListMode
    -- shopObject.Mode = false
    -- -- create an shopObject for 'ngme', has to pay 20% more than normal, beaware that this can be overwritten by GUI Example
    -- shopObject = ItemShop.TasItemShopCreateShop('ngme', false, 1.2, 1.2
    -- -- custom gold Cost function
    --     ,function(itemCode, cost, client, shop) return cost end
    -- -- custom lumber Cost function
    --     ,function(itemCode, cost, client, shop) return cost end
    -- )
    -- --'I002' crown +100 was never added to the database but this shop can craft/sell it.
    -- shopObject = ItemShop.TasItemShopAddShop('n002', 'ckng', 'I001', 'I002', 'arsh')
    -- shopObject.Mode = true


    -- Define skills/Buffs that change the costs in the shop
    -- cursed Units have to pay +25%
    -- ItemShop.TasItemShopAddHaggleSkill(FourCC('Bcrs'), 1.25, 1.25)

    -- define Fusions
    -- result created by 'xxx', 'xx' , 'x'...
    -- item can only be crafted by one way
    -- can add any amount of material in the Lua version
    ItemShop.FusionAdd('bgst', 'rst1', 'rst1')
    ItemShop.FusionAdd('ciri', 'rin1', 'rin1')
    ItemShop.FusionAdd('belv', 'rag1', 'rag1')
    ItemShop.FusionAdd('hval', 'rag1', 'rst1')
    ItemShop.FusionAdd('hcun', 'rag1', 'rin1')
    ItemShop.FusionAdd('mcou', 'rst1', 'rin1')
    ItemShop.FusionAdd('ckng', 'cnob', 'cnob')
    ItemShop.FusionAdd('rat9', 'rat6', 'rat6')
    ItemShop.FusionAdd('ratf', 'rat9', 'rat9')
    ItemShop.FusionAdd('rde4', 'rde3')
    ItemShop.FusionAdd('rde3', 'rde2')
    ItemShop.FusionAdd('rhth', 'prvt')
    ItemShop.FusionAdd('pmna', 'penr')
    ItemShop.FusionAdd('arsh', 'rde3', 'rde2')

    ItemShop.FusionAdd('lhst', 'sfog')

    -- crown of Kings + 50
    ItemShop.FusionAdd('I001', 'ckng', 'ckng', 'ckng', 'ckng', 'ckng', 'ckng', 'bgst', 'bgst', 'ciri', 'ciri', 'belv', 'belv', 'cnob', 'cnob')
    -- crown of Kings + 100, this is a joke you can not craft it because it was not added to buyAble Items
    ItemShop.FusionAdd('I002', 'I001', 'I001')

    -- define item Categories
    -- uses the locals from earlier.
    -- An item can have multiple categories just add them together like this: catStr + catAgi + catInt

    ItemShop.TasItemSetCategory('rst1', catStr)
    ItemShop.TasItemSetCategory('bgst', catStr)
    ItemShop.TasItemSetCategory('rin1', catInt)
    ItemShop.TasItemSetCategory('ciri', catInt)
    ItemShop.TasItemSetCategory('rag1', catAgi)
    ItemShop.TasItemSetCategory('belv', catAgi)

    ItemShop.TasItemSetCategory('I001', catStr + catAgi + catInt)

    ItemShop.TasItemSetCategory('ckng', catStr + catAgi + catInt)
    ItemShop.TasItemSetCategory('mcou', catStr + catInt)
    ItemShop.TasItemSetCategory('hval', catStr + catAgi)
    ItemShop.TasItemSetCategory('hcun', catAgi + catInt)
    ItemShop.TasItemSetCategory('cnob', catStr + catAgi + catInt)

    ItemShop.TasItemSetCategory('rat9', catDmg)
    ItemShop.TasItemSetCategory('rat6', catDmg)
    ItemShop.TasItemSetCategory('ratf', catDmg)

    ItemShop.TasItemSetCategory('rlif', catLifeReg)

    ItemShop.TasItemSetCategory('ajen', catAura + catAtkSpeed + catMoveSpeed)
    ItemShop.TasItemSetCategory('clfm', catAura + catDmg)
    ItemShop.TasItemSetCategory('ward', catAura + catDmg)
    ItemShop.TasItemSetCategory('kpin', catAura + catManaReg)
    ItemShop.TasItemSetCategory('lgdh', catAura + catMoveSpeed + catLifeReg)
    ItemShop.TasItemSetCategory('rde4', catArmor)
    ItemShop.TasItemSetCategory('pmna', catMana)
    ItemShop.TasItemSetCategory('rhth', catLife)
    ItemShop.TasItemSetCategory('ssil', catActive)
    ItemShop.TasItemSetCategory('lhst', catAura + catArmor)
    ItemShop.TasItemSetCategory('afac', catAura + catDmg)
    ItemShop.TasItemSetCategory('sbch', catAura + catDmg)
    ItemShop.TasItemSetCategory('sbch', catAura + catLifeSteal)
    ItemShop.TasItemSetCategory('brac', catMress)
    ItemShop.TasItemSetCategory('spsh', catMress + catActive)
    ItemShop.TasItemSetCategory('rwiz', catManaReg)
    ItemShop.TasItemSetCategory('crys', catActive)
    ItemShop.TasItemSetCategory('evtl', catEvade)
    ItemShop.TasItemSetCategory('penr', catMana)
    ItemShop.TasItemSetCategory('prvt', catLife)
    ItemShop.TasItemSetCategory('rde3', catArmor)
    ItemShop.TasItemSetCategory('bspd', catMoveSpeed)
    ItemShop.TasItemSetCategory('gcel', catAtkSpeed)
    ItemShop.TasItemSetCategory('rde2', catArmor)
    ItemShop.TasItemSetCategory('clsd', catActive)
    ItemShop.TasItemSetCategory('dsum', catActive + catMoveSpeed)
    ItemShop.TasItemSetCategory('stel', catActive + catMoveSpeed)
    ItemShop.TasItemSetCategory('desc', catActive + catMoveSpeed)
    ItemShop.TasItemSetCategory('ofro', catDmg + catOrb)
    ItemShop.TasItemSetCategory('modt', catLifeSteal + catOrb)
    ItemShop.TasItemSetCategory('thdm', catActive)
    ItemShop.TasItemSetCategory('hlst', catActive + catConsum + catLifeReg)
    ItemShop.TasItemSetCategory('mnst', catActive + catConsum + catManaReg)
    ItemShop.TasItemSetCategory('pghe', catActive + catConsum)
    ItemShop.TasItemSetCategory('pgma', catActive + catConsum)
    ItemShop.TasItemSetCategory('pnvu', catActive + catConsum)
    ItemShop.TasItemSetCategory('pres', catActive + catConsum)
    ItemShop.TasItemSetCategory('ankh', catConsum)
    ItemShop.TasItemSetCategory('stwp', catActive + catConsum + catMoveSpeed)
    ItemShop.TasItemSetCategory('shas', catActive + catConsum + catMoveSpeed)
    ItemShop.TasItemSetCategory('ofir', catOrb + catDmg)
    ItemShop.TasItemSetCategory('oli2', catOrb + catDmg)
    ItemShop.TasItemSetCategory('odef', catOrb + catDmg)
    ItemShop.TasItemSetCategory('oven', catOrb + catDmg)
    ItemShop.TasItemSetCategory('oslo', catOrb + catDmg)
    ItemShop.TasItemSetCategory('ocor', catOrb + catDmg)
    ItemShop.TasItemSetCategory('shtm', catActive)
    ItemShop.TasItemSetCategory('I004', catActive)
    ItemShop.TasItemSetCategory('I006', catActive)
end


function ItemShop.GetParent()
    local parent
    -- if TasItemShopUI.IsReforged then
    if false then
        parent = BlzGetFrameByName("ConsoleUIBackdrop", 0)
    else
        CreateLeaderboardBJ(bj_FORCE_ALL_PLAYERS, "title")
        parent = BlzGetFrameByName("Leaderboard", 0)
        BlzFrameSetSize(parent, 0, 0)
        BlzFrameSetVisible(BlzGetFrameByName("LeaderboardBackdrop", 0), false)
        BlzFrameSetVisible(BlzGetFrameByName("LeaderboardTitle", 0), false)
    end
    return parent
end

function ItemShop.IsValidShopper(player, shop, unit, range)
    if not IsUnitOwnedByPlayer(unit, player) then
        --print("IsUnitOwnedByPlayer")
        return false
    end
    if UnitInventorySize(unit) < 1 then
        --print("UnitInventorySize")
        return false
    end
    if IsUnitType(unit, UNIT_TYPE_DEAD) then
        --print("UNIT_TYPE_DEAD")
        return false
    end
    if IsUnitPaused(unit) then
        --print("IsUnitPaused")
        return false
    end
    if IsUnitHidden(unit) then
        --print("IsUnitHidden")
        return false
    end
    if IsUnitIllusion(unit) then
        --print("IsUnitIllusion")
        return false
    end
    if not IsUnitInRange(shop, unit, range) then
        --print("not IsUnitInRange")
        return false
    end
    return true
end

function ItemShop.CostModifier(gold, lumber, itemCode, buyer, shop, shopObject)
    -- this function is called for each Button that shows costs in the shop UI and right before buying the item.
    -- Beaware that this function is also called in a async manner -> no sideeffects or state changes.
    -- buyer got the Haggling skill?
    local level, skill
    for i, v in ipairs(ItemShop.BUY_ABLE_ITEMS) do
        skill = v[1]
        level = GetUnitAbilityLevel(buyer, skill)
        if level > 0 then
            gold = gold * (v[2] + v[4]*level)
            lumber = lumber * (v[3] + v[5]*level)
        end
    end

    if shopObject then
        gold = gold * shopObject.GoldFactor[itemCode]
        lumber = lumber * shopObject.LumberFactor[itemCode]
        if shopObject.Gold then
            gold = shopObject.Gold(itemCode, gold, buyer, shop)
        end
        if shopObject.Lumber then
            lumber = shopObject.Lumber(itemCode, lumber, buyer, shop)
        end
        
    end
    return math.floor(gold), math.floor(lumber)
end

function ItemShop.GetItemSellCosts(unit, shop, item)
    local itemCode = GetItemTypeId(item)
    local gold, lumber, charges = TasItemGetCost(itemCode)
    gold = gold * ItemShop.SellFactor
    lumber = lumber * ItemShop.SellFactor
    if ItemShop.SellUsesCostModifier then
        gold, lumber = ItemShop.CostModifier(gold, lumber, itemCode, unit, shop, TasItemShopUI.Shops[GetUnitTypeId(shop)])
    end
    if charges > 0 then
        gold = GetItemCharges(item)*gold/charges
        lumber = GetItemCharges(item)*lumber/charges
    end
    return math.floor(gold), math.floor(lumber), charges
end

function ItemShop.ShowSprite(frame, player)
    if player and GetLocalPlayer() ~= player then return end
    BlzFrameSetVisible(TasItemShopUI.Frames.SpriteParent, true)
    BlzFrameSetModel(TasItemShopUI.Frames.Sprite, ItemShop.spriteModel, 0)
    BlzFrameSetSpriteAnimate(TasItemShopUI.Frames.Sprite, ItemShop.spriteAnimationIndex, 0)
    BlzFrameSetPoint(TasItemShopUI.Frames.Sprite, FRAMEPOINT_CENTER, frame, FRAMEPOINT_CENTER, 0, 0)
end

function ItemShop.TasItemSetCategory(itemCode, category)
    if type(itemCode) == "string" then itemCode = FourCC(itemCode) end
    ItemShop.TasItemCategory[itemCode] = category
end

function ItemShop.TasItemShopAdd(itemCode, category)
    if type(itemCode) == "string" then itemCode = FourCC(itemCode) end
    ItemShop.TasItemSetCategory(itemCode, category)
    table.insert(ItemShop.BUY_ABLE_ITEMS, itemCode)
    TasItemCaclCost(itemCode)
    if bj_gameStarted then
        
    end
end

function ItemShop.TasItemShopAddHaggleSkill(skill, goldBase, lumberBase, goldAdd, lumberAdd)
    if not goldAdd then goldAdd = 0 end
    if not lumberAdd then lumberAdd = 0 end
    if not lumberBase then lumberBase = 1 end
    table.insert(ItemShop.BUY_ABLE_ITEMS, {skill, goldBase, lumberBase, goldAdd, lumberAdd})
end

function ItemShop.TasItemShopAddCategory(icon, text)
    if #TasItemShopUI.Categories >= #ItemShop.CategoryValue then print("To many Categories!! new category", text, icon) end
    table.insert(TasItemShopUI.Categories, {icon, text})
    return ItemShop.CategoryValue[#TasItemShopUI.Categories]
end

function ItemShop.TasItemShopCreateShop(unitCode, whiteList, goldFactor, lumberFactor, goldFunction, lumberFunction)
    if type(unitCode) == "string" then unitCode = FourCC(unitCode) end
    local shopObject = TasItemShopUI.Shops[unitCode]
    if not shopObject then
        if not goldFactor then goldFactor = 1.0 end
        if not lumberFactor then lumberFactor = 1.0 end
        shopObject = {Mode = whiteList, GoldFactor = __jarray(goldFactor), LumberFactor = __jarray(lumberFactor), Gold = goldFunction, Lumber = lumberFunction}
        TasItemShopUI.Shops[unitCode] = shopObject
    end
    
    return shopObject
end

function ItemShop.TasItemShopAddShop(unitCode, ...)
    local shopObject = ItemShop.TasItemShopCreateShop(unitCode)
    for i, v in ipairs({...}) do
        if type(v) == "string" then v = FourCC(v) end
        TasItemCaclCost(v)
        shopObject[v] = true
        --print(GetObjectName(v))
        table.insert(shopObject, v) 
    end
    return shopObject
end

function ItemShop.TasItemShopGoldFactor(unitCode, factor, ...)
    local shopObject = ItemShop.TasItemShopCreateShop(unitCode)
    for i, v in ipairs({...}) do
        if type(v) == "string" then v = FourCC(v) end
        shopObject.GoldFactor[v] = factor
        --print(GetObjectName(v))
    end
    return shopObject
end

function ItemShop.TasItemShopLumberFactor(unitCode, factor, ...)
    local shopObject = ItemShop.TasItemShopCreateShop(unitCode)
    for i, v in ipairs({...}) do
        if type(v) == "string" then v = FourCC(v) end
        shopObject.LumberFactor[v] = factor
        --print(GetObjectName(v))
    end
    return shopObject
end

function TasItemShopUI.ClearQuickLink(player)
    -- have that data already?
    for i = #TasItemShopUI.QuickLink[player], 1, -1 do
        TasItemShopUI.QuickLink[player][TasItemShopUI.QuickLink[player][i]] = nil
        TasItemShopUI.QuickLink[player][i] = nil
    end
end

function TasItemShopUI.SetQuickLink(player, itemCode)
    -- request to calc the itemCode costs, this is done in case it was not added to the shop
    TasItemCaclCost(itemCode) 
    -- have that data already?
    if TasItemShopUI.QuickLink[player][itemCode] then
        for i, v in ipairs(TasItemShopUI.QuickLink[player]) do
            if v == itemCode then
                table.remove(TasItemShopUI.QuickLink[player], i)
                TasItemShopUI.QuickLink[player][itemCode] = false
                -- reset offset when falling out of Page 2
                if #TasItemShopUI.QuickLink[player] <= ItemShop.refButtonCountQuickLink then
                    ItemShop.CurrentOffSetQuickLink[player] = 0
                end
                break
            end
        end
    else
        -- no, add it
        table.insert(TasItemShopUI.QuickLink[player], itemCode)
        TasItemShopUI.QuickLink[player][itemCode] = true
    end
end

function ItemShop.CanBuyItem(itemCode, shopObject, player)
    if shopObject then
        -- do not allow this itemCode or do exclude this itemCode => disallow
        if (not shopObject[itemCode] and shopObject.Mode) or (shopObject[itemCode] and not shopObject.Mode)  then
            return false
        end
        -- allow this for this shop?
        if shopObject[itemCode] and shopObject.Mode then
            return true
        end
    end
    return ItemShop.BUY_ABLE_ITEMS.Marker[player][itemCode]
end

function ItemShop.AllMatsProvided(player, itemCode, shopObject)
    local missing = {}
    local count = 0
    for i, v in ipairs(TasItemFusionGetMissingMaterial(TasItemFusion.Player[player].UseAble, itemCode)) do
        if not ItemShop.CanBuyItem(v, shopObject, player) then
            count = count + 1
            missing[count] = v
        end
    end
    return missing
end

function ItemShop.updateItemFrame(frameObject, data, showGold, showLumber)
        
    if frameObject.HighLight ~= nil then
        BlzFrameSetVisible(frameObject.HighLight, TasItemShopUI.MarkedItemCodes[data])
    end
    if showGold == nil then
        showGold = ItemShop.buttonListShowGold
        showLumber = ItemShop.buttonListShowLumber
    end
    BlzFrameSetTexture(frameObject.Icon, BlzGetAbilityIcon(data), 0, false)
    BlzFrameSetText(frameObject.Text, GetObjectName(data))

    BlzFrameSetTexture(frameObject.ToolTipFrameIcon, BlzGetAbilityIcon(data), 0, false)
    BlzFrameSetText(frameObject.ToolTipFrameName, GetObjectName(data))      
    -- frameObject.ToolTipFrameSeperator
    BlzFrameSetText(frameObject.ToolTipFrameText, BlzGetAbilityExtendedTooltip(data, 0))

    if string.len(BlzGetAbilityExtendedTooltip(data, 0)) >= ItemShop.toolTipLimitBig then
        BlzFrameSetSize(frameObject.ToolTipFrameText, ItemShop.toolTipSizeXBig, 0)
    else
        BlzFrameSetSize(frameObject.ToolTipFrameText, ItemShop.toolTipSizeX, 0)
    end


    if showGold or showLumber then
        local gold, lumber
        if TasItemFusion.BuiltWay[data] then
            gold, lumber = TasItemFusionCalc(TasItemFusion.Player[GetLocalPlayer()].UseAble, data, nil, true)
        else
            gold, lumber = TasItemGetCost(data)
        end
        gold, lumber = ItemShop.CostModifier(gold, lumber, data, ItemShop.ShoperMain[GetLocalPlayer()], ItemShop.CurrentShop[GetLocalPlayer()], ItemShop.LocalShopObject)
        BlzFrameSetVisible(frameObject.TextGold, showGold)
        BlzFrameSetVisible(frameObject.IconGold, showGold)
        if showGold then
            if GetPlayerState(GetLocalPlayer(), PLAYER_STATE_RESOURCE_GOLD) >= gold then
                BlzFrameSetText(frameObject.TextGold, string.format( "%%.0f", gold))
            else
                BlzFrameSetText(frameObject.TextGold, "|cffff2010"..string.format( "%%.0f", gold))
            end
        else
            -- this is done to reduce the taken size
            BlzFrameSetText(frameObject.TextGold, "0")
        end

        BlzFrameSetVisible(frameObject.TextLumber, showLumber)
        BlzFrameSetVisible(frameObject.IconLumber, showLumber)
        if showLumber then
            if GetPlayerState(GetLocalPlayer(), PLAYER_STATE_RESOURCE_LUMBER) >= lumber then
                BlzFrameSetText(frameObject.TextLumber, string.format( "%%.0f", lumber))
            else
                BlzFrameSetText(frameObject.TextLumber, "|cffff2010"..string.format( "%%.0f", lumber))
            end
        else
            BlzFrameSetText(frameObject.TextLumber, "0")
        end
    else
        BlzFrameSetVisible(frameObject.TextLumber, false)
        BlzFrameSetVisible(frameObject.IconLumber, false)
        BlzFrameSetVisible(frameObject.TextGold, false)
        BlzFrameSetVisible(frameObject.IconGold, false)
    end
    
end

function ItemShop.updateUndoButton(data, actionName)
    BlzFrameSetTexture(TasItemShopUI.Frames.UndoButtonIcon, BlzGetAbilityIcon(data), 0, false)
    BlzFrameSetTexture(TasItemShopUI.Frames.UndoButtonIconPushed, BlzGetAbilityIcon(data), 0, false)
    BlzFrameSetText(TasItemShopUI.Frames.UndoText, GetLocalizedString(ItemShop.textUndo).. actionName .. "\n" .. GetObjectName(data))
end

function ItemShop.GiveItem(unit, item, undo)
    local itemCode = GetItemTypeId(item)
    local oldCharges = GetItemCharges(item)
    -- when there are no charges, just give the item
    if oldCharges <= 0 then
        UnitAddItem(unit, item)
    else
        -- the item could be stacked.
        -- request triggerCount of the Itemstacking trigger, then give the item.
        local oldDataCount = GetItemStackingEventData()
        UnitAddItem(unit, item)                
        if undo then
            -- with undo, request the data again. If the counter is different -> a reforged item stacking event happend
            local newDataCount, stackedItem, chargeChange = GetItemStackingEventData()

            if newDataCount ~= oldDataCount then
                undo.StackChargesGainer = stackedItem
                undo.StackCharges = chargeChange
            -- no built in stacking event, but the user might have a custom stacking.
            elseif GetItemCharges(item) < oldCharges then
                for i = 0, bj_MAX_INVENTORY - 1 do
                    if GetItemTypeId(UnitItemInSlot(unit, i)) == itemCode then
                        undo.StackChargesGainer = UnitItemInSlot(unit, i)
                        undo.StackCharges = oldCharges - GetItemCharges(item)
                    end
                end
            end
        end
    end
end

function ItemShop.GiveItemGroup(player, item, undo)
    SetItemPlayer(item, player)
    ItemShop.GiveItem(ItemShop.ShoperMain[player], item, undo)
    -- other units can get the item when the mainShopper can not hold it?
    -- Check if item still exists and mainshopper does not have it.
    if ItemShop.canProviderGetItem and GetHandleId(item) > 0 and not UnitHasItem(ItemShop.ShoperMain[player], item)  then
        -- loop all mat provider try to give it to each, when that succeds finished.
        local found = false
        for i = 0, BlzGroupGetSize(ItemShop.Shoper[player]) - 1, 1 do
            local unit = BlzGroupUnitAt(ItemShop.Shoper[player], i)
            ItemShop.GiveItem(unit, item, undo)
            if GetHandleId(item) == 0 or UnitHasItem(unit, item) then
                found = true
                if ItemShop.canUndo then
                   table.insert(undo.ResultItem, {item, unit})
                end
                break
            end
        end
        if not found and ItemShop.canUndo then
            table.insert(undo.ResultItem, {item})
        end
    else
        if ItemShop.canUndo then
            table.insert(undo.ResultItem, {item, ItemShop.ShoperMain[player]})
        end
    end
end

function ItemShop.BuyItem(player, itemCode)
    xpcall( function()
    --print(GetPlayerName(player), "Wana Buy", GetObjectName(itemCode), "with", GetUnitName(ItemShop.ShoperMain[player]))
    if BlzGroupGetSize(ItemShop.Shoper[player]) == 0 then
        if GetLocalPlayer() == player then
            print(GetLocalizedString(ItemShop.textNoValidShopper))
        end
        return
    end
    local gold, lumber, items
    local shopObject = TasItemShopUI.Shops[GetUnitTypeId(ItemShop.CurrentShop[player])]
    -- can not buy this?
    if not ItemShop.flexibleShop and not ItemShop.CanBuyItem(itemCode, shopObject, player) then
        if GetLocalPlayer() == player then print(GetObjectName(itemCode), GetLocalizedString(ItemShop.textCanNotBuySufix)) end
        return
    end

    if TasItemFusion.BuiltWay[itemCode] then
        gold, lumber, items = TasItemFusionCalc(TasItemFusion.Player[player].UseAble, itemCode)
    else
        gold, lumber = TasItemGetCost(itemCode)
    end

    gold, lumber = ItemShop.CostModifier(gold, lumber, itemCode,  ItemShop.ShoperMain[player], ItemShop.CurrentShop[player], shopObject)

    -- only items buyable in the shop can be replaced by Gold? Also ignore non fusion items.
    if not ItemShop.flexibleShop and TasItemFusion.BuiltWay[itemCode] then
        local missingItemCode = ItemShop.AllMatsProvided(player, itemCode, shopObject)
        if #missingItemCode > 0 then
            if GetLocalPlayer() == player then print(GetLocalizedString(ItemShop.textCanNotBuyPrefix), GetObjectName(itemCode)) for i, v in ipairs(missingItemCode) do print(GetObjectName(v), GetLocalizedString(ItemShop.textCanNotBuySufix)) end end
            return
        end
    end

    if GetPlayerState(player, PLAYER_STATE_RESOURCE_GOLD) >= gold then
        if GetPlayerState(player, PLAYER_STATE_RESOURCE_LUMBER) >= lumber then
            local undo
            if ItemShop.canUndo then
                local units = {}
                undo = {ResultItem = {}, Result = itemCode, Gold = gold, Lumber = lumber, Items = {}, ActionName = "Buy"}
                table.insert(TasItemShopUI.Undo[player], undo)
                for i = 0, BlzGroupGetSize(ItemShop.Shoper[player]) - 1, 1 do
                    units[i + 1] = BlzGroupUnitAt(ItemShop.Shoper[player], i)
                end
                local owner
                if items then
                    for _,v in ipairs(items) do
                        for _,u in ipairs(units) do
                            if UnitHasItem(u, v) then
                                owner = u
                                break
                            end
                        end 
                        --table.insert(undo.Items, {GetItemTypeId(v), owner})
                        --RemoveItem(v)
                        table.insert(undo.Items, {v, owner})
                        --print(GetItemName(v), GetHandleId(v))
                        UnitRemoveItem(owner, v)
                        SetItemVisible(v, false)
                    end
                end
                if GetLocalPlayer() == player then
                    BlzFrameSetVisible(TasItemShopUI.Frames.BoxUndo, true)
                    ItemShop.updateUndoButton(undo.Result, undo.ActionName)
                end
            else
                if items then
                    for _,v in ipairs(items) do
                        RemoveItem(v)
                    end
                end
            end
            AdjustPlayerStateSimpleBJ(player, PLAYER_STATE_RESOURCE_GOLD, -gold)
            AdjustPlayerStateSimpleBJ(player, PLAYER_STATE_RESOURCE_LUMBER, -lumber)
            local newItem = CreateItem(itemCode, GetUnitX(ItemShop.ShoperMain[player]), GetUnitY(ItemShop.ShoperMain[player]))
            ItemShop.GiveItemGroup(player, newItem, undo)
            
            --CreateItem(itemCode, GetPlayerStartLocationX(player), GetPlayerStartLocationY(player))
            ItemShop.TasItemShopUIShow(player, ItemShop.CurrentShop[player])
        elseif not GetSoundIsPlaying(SoundNoLumber[GetPlayerRace(player)]) then
            StartSoundForPlayerBJ(player, SoundNoLumber[GetPlayerRace(player)])
        end
    elseif not GetSoundIsPlaying(SoundNoGold[GetPlayerRace(player)]) then
        StartSoundForPlayerBJ(player, SoundNoGold[GetPlayerRace(player)])
    end
end, print)
end

function ItemShop.SellItem(player, item)
    xpcall(function()
    local wasSelectedItem = (item == TasItemShopUI.SelectedItem[player])
    if not item then return end
    local itemCode = GetItemTypeId(item)

    local gold, lumber, charges = ItemShop.GetItemSellCosts(ItemShop.ShoperMain[player], ItemShop.CurrentShop[player], item)
    
    AdjustPlayerStateSimpleBJ(player, PLAYER_STATE_RESOURCE_GOLD, gold)
    AdjustPlayerStateSimpleBJ(player, PLAYER_STATE_RESOURCE_LUMBER, lumber)
    if ItemShop.canUndo then
        undo = {ResultItem = {}, Result = itemCode, Gold = -gold, Lumber = -lumber, Items = {}, ActionName = "Sell"}
        table.insert(TasItemShopUI.Undo[player], undo)
        for i = 0, BlzGroupGetSize(ItemShop.Shoper[player]) - 1, 1 do
            owner = BlzGroupUnitAt(ItemShop.Shoper[player], i)
            if UnitHasItem(owner, item) then
                UnitRemoveItem(owner, item)
                SetItemVisible(item, false)
                undo.Items[1] = {item, owner}
                break
            end
        end
        
        if GetLocalPlayer() == player then
            BlzFrameSetVisible(TasItemShopUI.Frames.BoxUndo, true)
            ItemShop.updateUndoButton(undo.Result, undo.ActionName)
        end
    else
        RemoveItem(item)
    end

    if wasSelectedItem then
        if GetLocalPlayer() == player then
            BlzFrameSetEnable(TasItemShopUI.Frames.SellButton, false)
            --BlzFrameSetVisible(TasItemShopUI.Frames.BoxSell, false)
        end
        TasItemShopUI.SelectedItem[player] = nil
    end
    end, print)
end

function ItemShop.updateRefButton(frameObject, data, unit, updateBroken)
    if data and data > 0 then
        BlzFrameSetVisible(frameObject.Button, true)
        BlzFrameSetTexture(frameObject.Icon, BlzGetAbilityIcon(data), 0, false)
        BlzFrameSetTexture(frameObject.IconPushed, BlzGetAbilityIcon(data), 0, false)
        BlzFrameSetTexture(frameObject.ToolTipFrameIcon, BlzGetAbilityIcon(data), 0, false)
        if frameObject.ToolTipFrameName then
            BlzFrameSetText(frameObject.ToolTipFrameName, GetObjectName(data))
            BlzFrameSetText(frameObject.ToolTipFrameText, BlzGetAbilityExtendedTooltip(data, 0))
            if string.len(BlzGetAbilityExtendedTooltip(data, 0)) >= ItemShop.toolTipLimitBig then
                BlzFrameSetSize(frameObject.ToolTipFrameText, ItemShop.toolTipSizeXBig, 0)
            else
                BlzFrameSetSize(frameObject.ToolTipFrameText, ItemShop.toolTipSizeX, 0)
            end
        else
            BlzFrameSetText(frameObject.ToolTipFrameText, GetObjectName(data))
        end
        
        if unit ~= nill and IsUnitType(unit, UNIT_TYPE_HERO) then
            BlzFrameSetText(frameObject.ToolTipFrameText, BlzFrameGetText(frameObject.ToolTipFrameText) .. "\n" .. GetHeroProperName(unit))
        end
        if updateBroken then
            BlzFrameSetVisible(frameObject.IconBroken, not ItemShop.CanBuyItem(data, ItemShop.LocalShopObject, GetLocalPlayer()))
        end
    else
        BlzFrameSetVisible(frameObject.Button, false)
    end
end

function ItemShop.updateRefButtons(dataTable, parent, refButtons, offSet, updateBroken)
    local count, valid, data, dataSize
    local validCounter = 0
    BlzFrameSetVisible(parent, true)
    BlzFrameSetText(refButtons.PageText, math.floor(offSet/#refButtons) + 1)
    if type(dataTable) == "table" then
        if dataTable.Count then
            count = dataTable.Count
        else
            count = #dataTable
        end
        for index, frameObject in ipairs(refButtons) do
            valid = index + offSet <= count
            if valid then
                validCounter = validCounter + 1
                data = dataTable[index + offSet]
                if type(data) == "table" then data = data.Result
                elseif type(data) == "userdata" and string.sub(tostring(data),1,5) =="item:" then
                    BlzFrameSetVisible(frameObject.IconDone, data == TasItemShopUI.SelectedItem[GetLocalPlayer()])
                    data = GetItemTypeId(data)
                end
                ItemShop.updateRefButton(frameObject, data, nil, updateBroken)
            else
                ItemShop.updateRefButton(frameObject, 0)
            end
        end
    elseif type(dataTable) == "userdata" and string.sub(tostring(dataTable),1,6) =="group:" then
        count = BlzGroupGetSize(dataTable)
        local data2
        for index, frameObject in ipairs(refButtons) do
            valid = index + offSet <= count
            if valid then
                validCounter = validCounter + 1
            end
            data = BlzGroupUnitAt(dataTable, index + offSet - 1)
            data2 = GetUnitTypeId(data)
            ItemShop.updateRefButton(frameObject, data2, data)
        end
    end
    BlzFrameSetVisible(refButtons.Page, count > #refButtons)
    return validCounter
end

function ItemShop.updateHaveMats(player, data)
    local itemCounter = __jarray(0)
    local mat
    local useable = TasItemFusion.Player[player].UseAble
    local offset = ItemShop.CurrentOffSetMaterial[player]
    for index, frameObject in ipairs(TasItemShopUI.Frames.Material) do
        if BlzFrameIsVisible(frameObject.Button) then
            mat = TasItemFusion.BuiltWay[data].Mats[index + offset]
            itemCounter[mat] = itemCounter[mat] + 1
            BlzFrameSetVisible(frameObject.IconDone, itemCounter[mat] <= useable.ByType[mat])
            BlzFrameSetVisible(frameObject.IconBroken, not BlzFrameIsVisible(frameObject.IconDone) and not ItemShop.CanBuyItem(mat, ItemShop.LocalShopObject, player))
        end
    end
end

function ItemShop.updateOverLayMainSelected(player)
    local offset = ItemShop.CurrentOffSetUser[player]
    for index, frameObject in ipairs(TasItemShopUI.Frames.User) do
        BlzFrameSetVisible(frameObject.IconDone, BlzFrameIsVisible(frameObject.Button) and ItemShop.ShoperMain[player] == BlzGroupUnitAt(ItemShop.Shoper[player], index - 1 + offset))
    end
end

function ItemShop.setSelected(player, data)
    local oldData = TasItemShopUI.Selected[player]
    TasItemShopUI.Selected[player] = data
    -- Reset RefPage only when a new data is selected
    if oldData ~= data then
        ItemShop.CurrentOffSetUpgrade[player] = 0
        ItemShop.CurrentOffSetMaterial[player] = 0
        TasItemShopUI.SelectedItem[player] = nil
        if player == GetLocalPlayer() then
            if ItemShop.canDefuse then BlzFrameSetEnable(TasItemShopUI.Frames.DefuseButton, false) end
            if ItemShop.canSellItems then BlzFrameSetEnable(TasItemShopUI.Frames.SellButton, false) end
        end
    end
    if player == GetLocalPlayer() then
        TasItemShopUI.MarkedItemCodes[oldData] = false
        TasItemShopUI.MarkedItemCodes[data] = true
        if ItemShop.refButtonCountUp > 0 then
            if TasItemFusion.UsedIn[data] then
                ItemShop.updateRefButtons(TasItemFusion.UsedIn[data], TasItemShopUI.Frames.BoxUpgrades, TasItemShopUI.Frames.Upgrades, ItemShop.CurrentOffSetUpgrade[player], true)
            else
                BlzFrameSetVisible(TasItemShopUI.Frames.BoxUpgrades, false)
            end
        end
        if ItemShop.refButtonCountMats > 0 then
            if TasItemFusion.BuiltWay[data] then
                ItemShop.updateRefButtons(TasItemFusion.BuiltWay[data].Mats, TasItemShopUI.Frames.BoxMaterial, TasItemShopUI.Frames.Material, ItemShop.CurrentOffSetMaterial[player])                
                ItemShop.updateHaveMats(player, data)
            else
                BlzFrameSetVisible(TasItemShopUI.Frames.BoxMaterial, false)
            end
        end
        if ItemShop.refButtonCountInv > 0 then
            if not ItemShop.inventoryShowMainOnly then
                if TasItemFusion.Player[player].UseAble.Count > 0 then
                    ItemShop.updateRefButtons(TasItemFusion.Player[player].UseAble, TasItemShopUI.Frames.BoxInventory, TasItemShopUI.Frames.Inventory, ItemShop.CurrentOffSetInventory[player])        
                else
                    BlzFrameSetVisible(TasItemShopUI.Frames.BoxInventory, false)
                end
            else
                TasItemShopUI.TempTable.Count = bj_MAX_INVENTORY
                for i = 0, bj_MAX_INVENTORY - 1 do
                    TasItemShopUI.TempTable[i + 1] = UnitItemInSlot(ItemShop.ShoperMain[player], i)
                end
                ItemShop.updateRefButtons(TasItemShopUI.TempTable, TasItemShopUI.Frames.BoxInventory, TasItemShopUI.Frames.Inventory, ItemShop.CurrentOffSetInventory[player])
                BlzFrameSetVisible(TasItemShopUI.Frames.BoxInventory, true)
            end
        end
        if ItemShop.refButtonCountQuickLink > 0 then
            ItemShop.updateRefButtons(TasItemShopUI.QuickLink[player], TasItemShopUI.Frames.BoxQuickLink, TasItemShopUI.Frames.QuickLink, ItemShop.CurrentOffSetQuickLink[player], true)
        end
        if ItemShop.refButtonCountUser > 0 then
            ItemShop.updateRefButtons(ItemShop.Shoper[player], TasItemShopUI.Frames.BoxUser, TasItemShopUI.Frames.User, ItemShop.CurrentOffSetUser[player])
            ItemShop.updateOverLayMainSelected(player)
        end

        
        ItemShop.updateItemFrame(TasItemShopUI.Frames.Current, data, ItemShop.buyButtonShowGold, ItemShop.buyButtonShowLumber)
        if not ItemShop.flexibleShop and (not ItemShop.CanBuyItem(data, ItemShop.LocalShopObject, GetLocalPlayer()) or (TasItemFusion.BuiltWay[data] and #ItemShop.AllMatsProvided(player, data, ItemShop.LocalShopObject) > 0)) then
            BlzFrameSetText(TasItemShopUI.Frames.Current.TextGold, GetLocalizedString(ItemShop.textUnBuyable))
            BlzFrameSetText(TasItemShopUI.Frames.Current.TextLumber, GetLocalizedString(ItemShop.textUnBuyable))
        end
    end
end

function ItemShop.setSelectedItem(player, item)
    TasItemShopUI.SelectedItem[player] = item
    if item ~= nil then
        local itemCode = GetItemTypeId(item)
        local gold, lumber, charges
        if GetLocalPlayer() == player then
            if ItemShop.canDefuse then
                BlzFrameSetText(TasItemShopUI.Frames.DefuseText, GetLocalizedString(ItemShop.textDefuse).."\n"..BlzGetAbilityTooltip(itemCode, 0))
                BlzFrameSetEnable(TasItemShopUI.Frames.DefuseButton, TasItemFusion.BuiltWay[itemCode] ~=nil)
            end

            if ItemShop.canSellItems then
                BlzFrameSetEnable(TasItemShopUI.Frames.SellButton, true)
                --BlzFrameSetVisible(TasItemShopUI.Frames.BoxSell, true)
                gold, lumber, charges = ItemShop.GetItemSellCosts(ItemShop.ShoperMain[player], ItemShop.CurrentShop[player], item)
                BlzFrameSetText(TasItemShopUI.Frames.SellText, GetLocalizedString(ItemShop.textSell) .. " " .. GetItemName(item) .. "\n" .. GetLocalizedString("GOLD") .. " " .. gold .. "\n"..GetLocalizedString("LUMBER") .." " .. lumber)
            end
        end
    end
end

function TasItemShopUI.Create()
    BlzLoadTOCFile("war3mapImported\\Templates.toc")
    BlzLoadTOCFile("war3mapImported\\TasItemShop.toc")

    local frames, parent, object, currentObject, frame
    parent = ItemShop.GetParent()

    if ItemShop.posScreenRelative then
        frame = BlzCreateFrameByType("FRAME", "Fullscreen", parent, "", 0)
        BlzFrameSetVisible(frame, false)
        BlzFrameSetSize(frame, 0.8, 0.6)
        BlzFrameSetAbsPoint(frame, FRAMEPOINT_BOTTOM, 0.4, 0)
        TasItemShopUI.Frames.Fullscreen = frame
    end

    ItemShop.xSize = 0.02 + ItemShop.buttonListCols*ItemShop.buttonListButtonSizeX + ItemShop.buttonListButtonGapCol * (ItemShop.buttonListCols - 1)
    --ItemShop.ySize = 0.1285 + ItemShop.buttonListRows*ItemShop.buttonListButtonSizeY + ItemShop.refButtonBoxSizeY
    ItemShop.ySize = 0.0815 + ItemShop.buttonListRows*ItemShop.buttonListButtonSizeY + ItemShop.buttonListButtonGapRow * (ItemShop.buttonListRows - 1)
    
    -- super
    TasItemShopUI.Frames.ParentSuper = BlzCreateFrameByType("FRAME", "TasItemShopUI", parent, "", 0)
    BlzFrameSetSize(TasItemShopUI.Frames.ParentSuper, 0.001, 0.001)
    
    parent = BlzCreateFrameByType("BUTTON", "TasItemShopUI", TasItemShopUI.Frames.ParentSuper, "", 0)
    BlzFrameSetSize(parent, ItemShop.xSize, ItemShop.ySize)
    BlzTriggerRegisterFrameEvent(TasItemShopUI.TriggerScrollParent, parent, FRAMEEVENT_MOUSE_WHEEL)
    BlzTriggerRegisterFrameEvent(TasItemShopUI.TriggerClearFocus, parent, FRAMEEVENT_CONTROL_CLICK)
    if ItemShop.posScreenRelative then
        BlzFrameSetPoint(parent, ItemShop.posPoint, TasItemShopUI.Frames.Fullscreen, ItemShop.posPoint, ItemShop.xPos, ItemShop.yPos)
    else
        BlzFrameSetAbsPoint(parent, ItemShop.posPoint, ItemShop.xPos, ItemShop.yPos)
    end
    
    TasItemShopUI.Frames.ParentSuperUI = parent


    frame = BlzCreateFrame(ItemShop.boxFrameName, parent, 0, 0)
    BlzFrameSetAllPoints(frame, parent)
    TasItemShopUI.Frames.BoxSuper = frame

    -- round down, boxSize - 2times gap to border / buttonSize + gap between buttons
    local buttonsInRow = math.floor(0.0 + ((ItemShop.xSize - (ItemShop.boxCatBorderGap)*2)/(ItemShop.categoryButtonSize + 0.003)))
    -- round up
    local rows = math.ceil(0.0+ (#TasItemShopUI.Categories/buttonsInRow))
    --print(#TasItemShopUI.Categories, buttonsInRow, rows)
    ItemShop.ySize = ItemShop.ySize + rows * ItemShop.categoryButtonSize
    -- ButtonList
    parent = BlzCreateFrame(ItemShop.boxButtonListFrameName, TasItemShopUI.Frames.BoxSuper, 0, 0)
    BlzFrameSetPoint(parent, FRAMEPOINT_TOPRIGHT, TasItemShopUI.Frames.BoxSuper, FRAMEPOINT_TOPRIGHT, 0, 0)  
    -- baseSizeY = 0.0455
    BlzFrameSetSize(parent, ItemShop.xSize, 0.0455 + ItemShop.buttonListRows*ItemShop.buttonListButtonSizeY + rows * ItemShop.categoryButtonSize + ItemShop.buttonListButtonGapRow * (ItemShop.buttonListRows - 1))
    --ItemShop.ySize = 0.1285 + ItemShop.buttonListRows*ItemShop.buttonListButtonSizeY + ItemShop.refButtonBoxSizeY
    object = CreateTasButtonListEx(ItemShop.buttonListButtonName, ItemShop.buttonListCols, ItemShop.buttonListRows, parent,
        function(clickedData, buttonListObject, dataIndex)
            local player = GetTriggerPlayer()
            
            if player == GetLocalPlayer() then
                local time = os.clock()
                if TasItemShopUI.Selected[player] == clickedData and time - ItemShop.DoubleClickStamp <= ItemShop.doubleClickTimeOut then
                    -- finish the timer, so the player has to do 2 clicks again to trigger a DoubleClick
                    ItemShop.DoubleClickStamp = 0
                    BlzFrameClick(TasItemShopUI.Frames.Current.Button)
                else
                    ItemShop.DoubleClickStamp = time
                end
            end
            if TasItemShopUI.QuickLinkKeyActive[player] then
                TasItemShopUI.SetQuickLink(player, clickedData)
            end

            ItemShop.setSelected(player, clickedData)
            
        end
        ,function(clickedData, buttonListObject, dataIndex) ItemShop.BuyItem(GetTriggerPlayer(), clickedData) end
        ,ItemShop.updateItemFrame
        ,function(data, searchedText, buttonListObject)
            --return string.find(GetObjectName(data), searchedText)
            return string.find(string.lower(GetObjectName(data)), string.lower(searchedText))
            --return string.find(string.lower(BlzGetAbilityExtendedTooltip(data, 0)), string.lower(searchedText))
        end
        ,function(data, buttonListObject, isTextSearching)
            local selected = TasItemShopUI.Categories.Value[GetLocalPlayer()]
            if ToggleIconButtonGetValue(TasItemShopUI.ModeObject, GetLocalPlayer()) == 0 then
                return selected == 0 or BlzBitAnd(ItemShop.TasItemCategory[data], selected) >= selected
            else
                return selected == 0 or BlzBitAnd(ItemShop.TasItemCategory[data], selected) > 0
            end
        end
        --async Left Click
        ,function(buttonListObject, data, frame)
        end
        --async Rigth Click
        ,function(buttonListObject, data, frame)
            ItemShop.ShowSprite(frame, GetLocalPlayer())
        end
        ,ItemShop.buttonListButtonGapCol
        ,ItemShop.buttonListButtonGapRow
    )
    TasItemShopUI.ButtonList = object
    TasItemShopUI.Frames.BoxButtonList = parent
    
    for i, frameObject in ipairs(object.Frames) do
        if ItemShop.buttonListHighLightFrameName then
            frameObject.HighLight = BlzCreateFrame(ItemShop.buttonListHighLightFrameName, frameObject.Button, 0, 0)
            BlzFrameSetAllPoints(frameObject.HighLight, frameObject.Button)
            BlzFrameSetVisible(frameObject.HighLight, false)
        end

    end
    
    
    -- category
    frame = BlzCreateFrame(ItemShop.boxCatFrameName, parent, 0, 0)
    BlzFrameSetPoint(frame, FRAMEPOINT_TOPRIGHT, TasItemShopUI.ButtonList.InputFrame, FRAMEPOINT_BOTTOMRIGHT, 0, 0)
    BlzFrameSetSize(frame, ItemShop.xSize, 0.0135 + rows * ItemShop.categoryButtonSize)
    TasItemShopUI.Frames.BoxCategory = frame
    parent = frame
    frames = {}
    local groupObject = CreateToggleIconButtonGroup(true, function(groupObject, buttonObject, player, groupValue)
        TasItemShopUI.Categories.Value[player] = groupValue
        TasButtonListSearch(TasItemShopUI.ButtonList)
    end)
    ToggleIconButton.DefaultSizeX = ItemShop.categoryButtonSize
    ToggleIconButton.DefaultSizeY = ItemShop.categoryButtonSize
    --frame = ToggleIconButtonGroupModeButton(groupObject, parent).Button
    local clearButton = ToggleIconButtonGroupClearButton(groupObject, parent)
    --BlzFrameSetPoint(frame, FRAMEPOINT_TOPLEFT, TasItemShopUI.Frames.BoxSuper, FRAMEPOINT_TOPLEFT, ItemShop.boxFrameBorderGap, -ItemShop.boxFrameBorderGap)
    BlzFrameSetPoint(clearButton, FRAMEPOINT_TOPLEFT, TasItemShopUI.Frames.BoxSuper, FRAMEPOINT_TOPLEFT, ItemShop.boxFrameBorderGap, -ItemShop.boxFrameBorderGap)
    BlzTriggerRegisterFrameEvent(TasItemShopUI.TriggerClearButton, clearButton, FRAMEEVENT_CONTROL_CLICK)
    BlzTriggerRegisterFrameEvent(TasItemShopUI.TriggerClearFocus, clearButton, FRAMEEVENT_CONTROL_CLICK)

    local modeObject = CreateToggleIconButton(parent, 1, GetLocalizedString(ItemShop.categoryModeTextOr), ItemShop.categoryModeIconOr, 0, GetLocalizedString(ItemShop.categoryModeTextAnd), ItemShop.categoryModeIconAnd)
    BlzFrameSetPoint(modeObject.Button, FRAMEPOINT_BOTTOMLEFT, clearButton, FRAMEPOINT_BOTTOMRIGHT, 0.003, 0)
    modeObject.Action = function()
        if GetTriggerPlayer() == GetLocalPlayer() then
            TasButtonListSearch(TasItemShopUI.ButtonList)
        end
    end
    TasItemShopUI.ModeObject = modeObject
    

    for index, value in ipairs(TasItemShopUI.Categories) do
        frames[index] = CreateToggleIconButton(parent, ItemShop.CategoryValue[index], GetLocalizedString(value[2]), value[1])
        if index == 1 then      
            BlzFrameSetPoint(frames[index].Button, FRAMEPOINT_TOPLEFT, parent, FRAMEPOINT_TOPLEFT, ItemShop.boxCatBorderGap, -ItemShop.boxCatBorderGap)
        else
            BlzFrameSetPoint(frames[index].Button, FRAMEPOINT_TOPLEFT, frames[index - 1].Button, FRAMEPOINT_TOPRIGHT, 0.003, 0)
        end
        ToggleIconButtonGroupAddButton(groupObject, frames[index])
    end

    for index = 2, rows, 1 do
    --    print((index-1)*buttonsInRow + 1, "->", (index-2)*buttonsInRow + 1)
        BlzFrameSetPoint(frames[(index-1)*buttonsInRow + 1].Button, FRAMEPOINT_TOPLEFT, frames[(index-2)*buttonsInRow + 1].Button, FRAMEPOINT_BOTTOMLEFT, 0, -0.001)        
    end

    frame = TasItemShopUI.ButtonList.Frames[1].Button
    BlzFrameClearAllPoints(frame)
    BlzFrameSetPoint(frame, FRAMEPOINT_TOPLEFT, TasItemShopUI.Frames.BoxCategory, FRAMEPOINT_BOTTOMLEFT, 0.0045, 0)


    if ItemShop.toolTipPosX and ItemShop.toolTipPosX then
        for i, v in ipairs(TasItemShopUI.ButtonList.Frames) do
            BlzFrameClearAllPoints(v.ToolTipFrameText)
            if ItemShop.toolTipPosPointParent then
                BlzFrameSetPoint(v.ToolTipFrameText, ItemShop.toolTipPosPoint, v.Button, ItemShop.toolTipPosPointParent, ItemShop.toolTipPosX, ItemShop.toolTipPosX)                
            else
                BlzFrameSetAbsPoint(v.ToolTipFrameText, ItemShop.toolTipPosPoint, ItemShop.toolTipPosX, ItemShop.toolTipPosX)
            end
        end
    end


    local function CreateRefButtons(amount, parent, textFrame, trigger, haveTooltip)
        frames = {}
        for index = 1, amount do
            frames[index] = {
                Button = BlzCreateFrame("TasItemShopRefButton", parent, 0, 0),
            }
            frame = frames[index].Button
            BlzFrameSetText(frame, index)
            frames[index].Icon = BlzGetFrameByName("TasItemShopRefButtonBackdrop", 0)
            frames[index].IconPushed = BlzGetFrameByName("TasItemShopRefButtonBackdropPushed", 0)
            frames[index].IconDone = BlzGetFrameByName("TasItemShopRefButtonBackdropBackdrop", 0)
            frames[index].IconBroken = BlzGetFrameByName("TasItemShopRefButtonBackdropBackdrop2", 0)
            BlzFrameSetSize(frame, ItemShop.refButtonSize, ItemShop.refButtonSize)
            
            BlzFrameSetVisible(frames[index].IconDone, false)
            BlzFrameSetVisible(frames[index].IconBroken, false)
            if haveTooltip then
                CreateTasButtonTooltip(frames[index], TasItemShopUI.Frames.BoxSuper)
                
                if ItemShop.toolTipPosX and ItemShop.toolTipPosX then
                    BlzFrameClearAllPoints(frames[index].ToolTipFrameText)
                    if ItemShop.toolTipPosPointParent then
                        BlzFrameSetPoint(frames[index].ToolTipFrameText, ItemShop.toolTipPosPoint, frames[index].Button, ItemShop.toolTipPosPointParent, ItemShop.toolTipPosX, ItemShop.toolTipPosX)
                    else
                        BlzFrameSetAbsPoint(frames[index].ToolTipFrameText, ItemShop.toolTipPosPoint, ItemShop.toolTipPosX, ItemShop.toolTipPosX)
                    end
                end
            end
            if index == 1 then
                BlzFrameSetPoint(frame, FRAMEPOINT_TOPLEFT, textFrame, FRAMEPOINT_BOTTOMLEFT, 0.0, -0.003)
            --elseif index == 5 then
            -- BlzFrameSetPoint(frame, FRAMEPOINT_BOTTOMLEFT, frames[index - 4].Button, FRAMEPOINT_TOPLEFT, 0, 0.003)
            else
                BlzFrameSetPoint(frame, FRAMEPOINT_BOTTOMLEFT, frames[index - 1].Button, FRAMEPOINT_BOTTOMRIGHT, ItemShop.refButtonGap, 0)
            end

            BlzTriggerRegisterFrameEvent(trigger, frame, FRAMEEVENT_CONTROL_CLICK)
            BlzTriggerRegisterFrameEvent(TasItemShopUI.TriggerClearFocus, frame, FRAMEEVENT_CONTROL_CLICK)
            
            BlzTriggerRegisterFrameEvent(trigger, frame, FRAMEEVENT_MOUSE_UP)
            
        end
        return frames
    end
    local function MakeRefButtonsCol(box, textFrame, frames)
        BlzFrameClearAllPoints(box)
        BlzFrameClearAllPoints(frames.PageDown)
        BlzFrameSetPoint(frames.PageDown, FRAMEPOINT_TOPRIGHT, textFrame, FRAMEPOINT_BOTTOMRIGHT, 0.0, -ItemShop.refButtonGap)
        for i, v in ipairs(frames) do
            
            BlzFrameClearAllPoints(v.Button)
            if i == 1 then
                BlzFrameSetPoint(v.Button, FRAMEPOINT_TOP, box, FRAMEPOINT_TOP, 0.0, -BlzFrameGetHeight(textFrame) - ItemShop.refButtonPageSize -ItemShop.refButtonGap*2 -ItemShop.boxFrameBorderGap)
            else
                BlzFrameSetPoint(v.Button, FRAMEPOINT_TOPLEFT, frames[i - 1].Button, FRAMEPOINT_BOTTOMLEFT, 0, -ItemShop.refButtonGap)
            end
        end
        BlzFrameSetSize(box, BlzFrameGetWidth(textFrame) + ItemShop.boxFrameBorderGap*2 , (ItemShop.refButtonSize + ItemShop.refButtonGap)*#frames + ItemShop.refButtonPageSize + ItemShop.boxFrameBorderGap*2)
    end
    local function CreateRefPage(parent, textFrame, trigger, pageSize, refButtons)
        frames = {}
        
        frames[1] = BlzCreateFrameByType("FRAME", "TasItemShopUIPageControl", parent, "", 0)
        frames[2] = BlzCreateFrame("TasItemShopCatButton", frames[1], 0, 0)
        frames[3] = BlzGetFrameByName("TasItemShopCatButtonBackdrop", 0)
        frames[4] = BlzGetFrameByName("TasItemShopCatButtonBackdropPushed", 0)
        frames[5] = BlzCreateFrame("TasItemShopCatButton", frames[1], 0, 0)
        frames[6] = BlzGetFrameByName("TasItemShopCatButtonBackdrop", 0)
        frames[7] = BlzGetFrameByName("TasItemShopCatButtonBackdropPushed", 0)
        frames[8] = BlzCreateFrame("TasButtonTextTemplate", frames[1], 0, 0)
        BlzFrameSetText(frames[8], "00")
        BlzFrameSetSize(frames[2], ItemShop.refButtonPageSize, ItemShop.refButtonPageSize)
        BlzFrameSetSize(frames[5], ItemShop.refButtonPageSize, ItemShop.refButtonPageSize)
        BlzTriggerRegisterFrameEvent(trigger, frames[2], FRAMEEVENT_CONTROL_CLICK)
        BlzTriggerRegisterFrameEvent(trigger, frames[2], FRAMEEVENT_MOUSE_UP)
        BlzTriggerRegisterFrameEvent(TasItemShopUI.TriggerClearFocus, frames[2], FRAMEEVENT_CONTROL_CLICK)
        BlzTriggerRegisterFrameEvent(trigger, frames[5], FRAMEEVENT_CONTROL_CLICK)
        BlzTriggerRegisterFrameEvent(trigger, frames[5], FRAMEEVENT_MOUSE_UP)
        BlzTriggerRegisterFrameEvent(TasItemShopUI.TriggerClearFocus, frames[5], FRAMEEVENT_CONTROL_CLICK)
        BlzFrameSetTexture(frames[3], ItemShop.refButtonPageUp, 0, false)
        BlzFrameSetTexture(frames[4], ItemShop.refButtonPageUp, 0, false)
        BlzFrameSetTexture(frames[6], ItemShop.refButtonPageDown, 0, false)
        BlzFrameSetTexture(frames[7], ItemShop.refButtonPageDown, 0, false)

        --BlzFrameSetPoint(frames[2], FRAMEPOINT_TOPLEFT, textFrame, FRAMEPOINT_TOPRIGHT, 0.003, 0)
        --BlzFrameSetPoint(frames[8], FRAMEPOINT_TOPLEFT, frames[2], FRAMEPOINT_TOPRIGHT, 0.003, 0)
        --BlzFrameSetPoint(frames[5], FRAMEPOINT_TOPLEFT, frames[8], FRAMEPOINT_TOPRIGHT, 0.003, 0)

        BlzFrameSetPoint(frames[2], FRAMEPOINT_TOPRIGHT, frames[8], FRAMEPOINT_TOPLEFT, -0.003, 0)
        BlzFrameSetPoint(frames[8], FRAMEPOINT_TOPRIGHT, frames[5], FRAMEPOINT_TOPLEFT, -0.003, 0)
        BlzFrameSetPoint(frames[5], FRAMEPOINT_TOPRIGHT, parent, FRAMEPOINT_TOPRIGHT, -ItemShop.boxFrameBorderGap, -ItemShop.boxFrameBorderGap)

        --BlzFrameSetPoint(frames[2], FRAMEPOINT_TOPLEFT, textFrame, FRAMEPOINT_BOTTOMLEFT, 0, -0.003)
        --BlzFrameSetPoint(frames[8], FRAMEPOINT_TOPLEFT, textFrame, FRAMEPOINT_TOPRIGHT, 0.003, 0)
        --BlzFrameSetPoint(frames[5], FRAMEPOINT_TOPLEFT, frames[2], FRAMEPOINT_BOTTOMLEFT, 0, -0.003)


        --CreateTasButtonTooltip(frames[index], TasItemShopUI.Frames.BoxSuper)
        TasItemShopUI.Frames[frames[2]] = pageSize
        TasItemShopUI.Frames[frames[5]] = -pageSize

        refButtons.Page = frames[1]
        refButtons.PageUp = frames[2]
        refButtons.PageDown = frames[5]
        refButtons.PageText = frames[8]
        return frames
    end
    local refRows = {}
    
    local function PlaceRefButtonBox(box)
        BlzFrameClearAllPoints(box)
        if #refRows == 0 then
            BlzFrameSetPoint(box, FRAMEPOINT_TOPRIGHT, TasItemShopUI.Frames.BoxButtonList, FRAMEPOINT_BOTTOMRIGHT, 0, 0)
            refRows[1] = {ItemShop.xSize - BlzFrameGetWidth(box), box}
            ItemShop.ySize = ItemShop.ySize + ItemShop.refButtonBoxSizeY
            BlzFrameSetSize(TasItemShopUI.Frames.ParentSuperUI, ItemShop.xSize, ItemShop.ySize)
            return #refRows
        else
            local found = false
            for i, v in ipairs(refRows) do
                if v[1] - BlzFrameGetWidth(box) >= 0 then
                    found = true
                    BlzFrameSetPoint(box, FRAMEPOINT_TOPRIGHT, v[#v], FRAMEPOINT_TOPLEFT, 0, 0)
                    table.insert(v, box)
                    v[1] = v[1] - BlzFrameGetWidth(box)
                    return i
                end
            end
            if not found then
                BlzFrameSetPoint(box, FRAMEPOINT_TOPRIGHT, refRows[#refRows][2], FRAMEPOINT_BOTTOMRIGHT, 0, 0)
                table.insert(refRows, {ItemShop.xSize - BlzFrameGetWidth(box), box})
                ItemShop.ySize = ItemShop.ySize + ItemShop.refButtonBoxSizeY
                BlzFrameSetSize(TasItemShopUI.Frames.ParentSuperUI, ItemShop.xSize, ItemShop.ySize)
                return #refRows
            end
        end
        
    end

    local function PlaceRefButtonBoxCol(box)
        
        if #refRows == 0 then
            BlzFrameSetPoint(box, FRAMEPOINT_TOPRIGHT, TasItemShopUI.Frames.ParentSuperUI, FRAMEPOINT_TOPLEFT, 0, 0)
            refRows[1] = {ItemShop.ySize - BlzFrameGetHeight(box), box}
            return #refRows
        else
            local found = false
            for i, v in ipairs(refRows) do
                if v[1] - BlzFrameGetHeight(box) >= 0 then
                    found = true
                    BlzFrameSetPoint(box, FRAMEPOINT_TOPRIGHT, v[#v], FRAMEPOINT_BOTTOMRIGHT, 0, 0)
                    table.insert(v, box)
                    
                    v[1] = v[1] - BlzFrameGetHeight(box)
                    return i
                    --break
                end
            end
            if not found then
                BlzFrameSetPoint(box, FRAMEPOINT_TOPRIGHT, refRows[#refRows][2], FRAMEPOINT_TOPLEFT, 0, 0)
                table.insert(refRows, {ItemShop.ySize - BlzFrameGetHeight(box), box})
                return #refRows
            end
        end
    end
   
    
    -- built from
    if ItemShop.refButtonCountMats > 0 then
        parent = BlzCreateFrame(ItemShop.boxRefFrameName, TasItemShopUI.Frames.BoxSuper, 0, 0)
        BlzFrameSetSize(parent, (ItemShop.refButtonSize + ItemShop.refButtonGap)*ItemShop.refButtonCountMats + ItemShop.boxFrameBorderGap*2, ItemShop.refButtonBoxSizeY)
        local row = PlaceRefButtonBox(parent)
        TasItemShopUI.Frames.BoxMaterial = parent

        frame = BlzCreateFrame("TasButtonTextTemplate", parent, 0, 0)
        BlzFrameSetPoint(frame, FRAMEPOINT_TOPLEFT, parent, FRAMEPOINT_TOPLEFT, ItemShop.boxRefBorderGap, -ItemShop.boxRefBorderGap)
        BlzFrameSetText(frame, GetLocalizedString(ItemShop.textMats))
        TasItemShopUI.Frames.MaterialText = frame

        TasItemShopUI.Frames.Material = CreateRefButtons(ItemShop.refButtonCountMats, parent, frame, TasItemShopUI.TriggerMaterial, true)

        CreateRefPage(parent, TasItemShopUI.Frames.MaterialText, TasItemShopUI.TriggerMaterialPage, ItemShop.refButtonCountMats, TasItemShopUI.Frames.Material)
    end

    -- possible upgrades
    if ItemShop.refButtonCountUp > 0 then
        parent = BlzCreateFrame(ItemShop.boxRefFrameName, TasItemShopUI.Frames.BoxSuper, 0, 0)
        BlzFrameSetSize(parent, (ItemShop.refButtonSize + ItemShop.refButtonGap)*ItemShop.refButtonCountUp + ItemShop.boxFrameBorderGap*2, ItemShop.refButtonBoxSizeY)
        local row = PlaceRefButtonBox(parent)
        TasItemShopUI.Frames.BoxUpgrades = parent

        frame = BlzCreateFrame("TasButtonTextTemplate", parent, 0, 0)
        BlzFrameSetPoint(frame, FRAMEPOINT_TOPLEFT, parent, FRAMEPOINT_TOPLEFT, ItemShop.boxRefBorderGap, -ItemShop.boxRefBorderGap)
        BlzFrameSetText(frame, GetLocalizedString(ItemShop.textUpgrades))
        TasItemShopUI.Frames.UpgradesText = frame

        TasItemShopUI.Frames.Upgrades = CreateRefButtons(ItemShop.refButtonCountUp, parent, frame, TasItemShopUI.TriggerUpgrade, true)

        CreateRefPage(parent, TasItemShopUI.Frames.UpgradesText, TasItemShopUI.TriggerUpgradePage, ItemShop.refButtonCountUp, TasItemShopUI.Frames.Upgrades)
    end  
    
    -- ShortCuts
    if ItemShop.refButtonCountQuickLink > 0 then
        parent = BlzCreateFrame(ItemShop.boxRefFrameName, TasItemShopUI.Frames.BoxSuper, 0, 0)
        BlzFrameSetSize(parent, (ItemShop.refButtonSize + ItemShop.refButtonGap)*ItemShop.refButtonCountQuickLink + ItemShop.boxFrameBorderGap*2, ItemShop.refButtonBoxSizeY)
        local row = PlaceRefButtonBox(parent)
        TasItemShopUI.Frames.BoxQuickLink = parent

        frame = BlzCreateFrame("TasButtonTextTemplate", parent, 0, 0)
        BlzFrameSetPoint(frame, FRAMEPOINT_TOPLEFT, parent, FRAMEPOINT_TOPLEFT, ItemShop.boxRefBorderGap, -ItemShop.boxRefBorderGap)
        BlzFrameSetText(frame, GetLocalizedString(ItemShop.textQuickLink))
        TasItemShopUI.Frames.QuickLinkText = frame

        TasItemShopUI.Frames.QuickLinkHighLight = BlzCreateFrame(ItemShop.buttonListHighLightFrameName, parent, 0, 0)
        BlzFrameSetAllPoints(TasItemShopUI.Frames.QuickLinkHighLight, parent)
        BlzFrameSetVisible(TasItemShopUI.Frames.QuickLinkHighLight, false)

        TasItemShopUI.Frames.QuickLink = CreateRefButtons(ItemShop.refButtonCountQuickLink, parent, frame, TasItemShopUI.TriggerQuickLink, true)

        CreateRefPage(parent, TasItemShopUI.Frames.QuickLinkText, TasItemShopUI.TriggerQuickLinkPage, ItemShop.refButtonCountQuickLink, TasItemShopUI.Frames.QuickLink)
    end

    -- Inventory
    if ItemShop.refButtonCountInv > 0 then
        parent = BlzCreateFrame(ItemShop.boxRefFrameName, TasItemShopUI.Frames.BoxSuper, 0, 0)
        BlzFrameSetSize(parent, (ItemShop.refButtonSize + ItemShop.refButtonGap)*ItemShop.refButtonCountInv + ItemShop.boxFrameBorderGap*2, ItemShop.refButtonBoxSizeY)
        local row = PlaceRefButtonBox(parent)
        
        TasItemShopUI.Frames.BoxInventory = parent

        frame = BlzCreateFrame("TasButtonTextTemplate", parent, 0, 0)
        BlzFrameSetPoint(frame, FRAMEPOINT_TOPLEFT, parent, FRAMEPOINT_TOPLEFT, ItemShop.boxRefBorderGap, -ItemShop.boxRefBorderGap)
        BlzFrameSetText(frame, GetLocalizedString(ItemShop.textInventory))
        TasItemShopUI.Frames.InventoryText = frame

        TasItemShopUI.Frames.Inventory = CreateRefButtons(ItemShop.refButtonCountInv, parent, frame, TasItemShopUI.TriggerInventory, true)

        for i, v in ipairs(TasItemShopUI.Frames.Inventory) do
            BlzFrameSetTexture(v.IconDone, ItemShop.MainItemTexture, 0, true)
        end

        CreateRefPage(parent, TasItemShopUI.Frames.InventoryText, TasItemShopUI.TriggerInventoryPage, ItemShop.refButtonCountInv, TasItemShopUI.Frames.Inventory)
    end

    -- User
    if ItemShop.refButtonCountUser > 0 then
        parent = BlzCreateFrame(ItemShop.boxRefFrameName, TasItemShopUI.Frames.BoxSuper, 0, 0)
        BlzFrameSetSize(parent, (ItemShop.refButtonSize + ItemShop.refButtonGap)*ItemShop.refButtonCountUser + ItemShop.boxFrameBorderGap*2, ItemShop.refButtonBoxSizeY)

        PlaceRefButtonBox(parent)
        if refBoxUserPos then
            PlaceRefButtonBoxFree(parent, refBoxUserPos, refBoxUserRelative, refBoxUserPosRelative, refBoxUserX, refBoxUserY, refBoxUserDirection)
        else
            
        end
        TasItemShopUI.Frames.BoxUser = parent

        frame = BlzCreateFrame("TasButtonTextTemplate", parent, 0, 0)
        BlzFrameSetPoint(frame, FRAMEPOINT_TOPLEFT, parent, FRAMEPOINT_TOPLEFT, ItemShop.boxRefBorderGap, -ItemShop.boxRefBorderGap)
        BlzFrameSetText(frame, GetLocalizedString(ItemShop.textUser))
        TasItemShopUI.Frames.UserText = frame
        TasItemShopUI.Frames.User = CreateRefButtons(ItemShop.refButtonCountUser, parent, frame, TasItemShopUI.TriggerUser, false)

        
        for i, v in ipairs(TasItemShopUI.Frames.User) do
            BlzFrameSetTexture(v.IconDone, ItemShop.MainUserTexture, 0, true)
            v.ToolTipFrameText = CreateSimpleTooltip(v.Button, "User")
        end

        CreateRefPage(parent, TasItemShopUI.Frames.UserText, TasItemShopUI.TriggerUserPage, ItemShop.refButtonCountUser, TasItemShopUI.Frames.User)
    end
    
    local frameObject = {}
    frameObject.Index = int
    
    frameObject.Button = BlzCreateFrame("TasButton", TasItemShopUI.Frames.BoxSuper, 0, 0)
    CreateTasButtonTooltip(frameObject, TasItemShopUI.Frames.BoxSuper)

    frameObject.Icon = BlzGetFrameByName("TasButtonIcon", 0)
    frameObject.Text = BlzGetFrameByName("TasButtonText", 0)
    frameObject.IconGold = BlzGetFrameByName("TasButtonIconGold", 0)
    frameObject.TextGold = BlzGetFrameByName("TasButtonTextGold", 0)
    frameObject.IconLumber = BlzGetFrameByName("TasButtonIconLumber", 0)
    frameObject.TextLumber = BlzGetFrameByName("TasButtonTextLumber", 0)
    BlzFrameSetPoint(frameObject.Button, FRAMEPOINT_BOTTOM, TasItemShopUI.Frames.BoxSuper, FRAMEPOINT_BOTTOM, 0, ItemShop.boxFrameBorderGap)
    TasItemShopUI.Frames.Current = frameObject
    currentObject = frameObject
    BlzTriggerRegisterFrameEvent(TasItemShopUI.TriggerBuy, currentObject.Button, FRAMEEVENT_CONTROL_CLICK)
    BlzTriggerRegisterFrameEvent(TasItemShopUI.TriggerClearFocus, currentObject.Button, FRAMEEVENT_CONTROL_CLICK)

    
    frame = BlzCreateFrame("TasButtonTextTemplate", TasItemShopUI.Frames.BoxSuper, 0, 0)
    BlzFrameSetPoint(frame, FRAMEPOINT_BOTTOMRIGHT, TasItemShopUI.ButtonList.InputFrame, FRAMEPOINT_BOTTOMLEFT, -ItemShop.boxFrameBorderGap, 0)
    BlzFrameSetPoint(frame, FRAMEPOINT_TOPLEFT, modeObject.Button, FRAMEPOINT_TOPRIGHT, ItemShop.boxFrameBorderGap, 0)
    BlzFrameSetTextAlignment(frame, TEXT_JUSTIFY_CENTER, TEXT_JUSTIFY_MIDDLE)
    BlzFrameSetText(frame, "Name")
    TasItemShopUI.Frames.TitelText = frame

    BlzFrameClearAllPoints(currentObject.ToolTipFrameText)
    if ItemShop.toolTipPosPointParent then
        BlzFrameSetPoint(currentObject.ToolTipFrameText, ItemShop.toolTipPosPoint, currentObject.Button, ItemShop.toolTipPosPointParent, ItemShop.toolTipPosX, ItemShop.toolTipPosX)
    else
        BlzFrameSetAbsPoint(currentObject.ToolTipFrameText, ItemShop.toolTipPosPoint, ItemShop.toolTipPosX, ItemShop.toolTipPosX)
    end

    if ItemShop.canUndo then
        parent = BlzCreateFrame(ItemShop.boxUndoFrameName, TasItemShopUI.Frames.BoxSuper, 0, 0)
        BlzFrameSetSize(parent, ItemShop.refButtonSize + ItemShop.boxUndoBorderGap*2, ItemShop.refButtonSize + ItemShop.boxUndoBorderGap*2)
        BlzFrameSetPoint(parent, FRAMEPOINT_BOTTOMLEFT, TasItemShopUI.Frames.BoxSuper, FRAMEPOINT_BOTTOMLEFT, 0.00, 0.00)
        TasItemShopUI.Frames.BoxUndo = parent
        TasItemShopUI.Frames.UndoButton = BlzCreateFrame("TasItemShopCatButton", parent, 0, 0)
        TasItemShopUI.Frames.UndoButtonIcon = BlzGetFrameByName("TasItemShopCatButtonBackdrop", 0)
        TasItemShopUI.Frames.UndoButtonIconPushed = BlzGetFrameByName("TasItemShopCatButtonBackdropPushed", 0)
        TasItemShopUI.Frames.UndoText = CreateSimpleTooltip(TasItemShopUI.Frames.UndoButton, ItemShop.textUndo)

        frame = TasItemShopUI.Frames.UndoButton
        BlzFrameSetSize(frame, ItemShop.refButtonSize, ItemShop.refButtonSize)
        BlzFrameSetPoint(frame, FRAMEPOINT_CENTER, parent, FRAMEPOINT_CENTER, 0, 0)
        BlzTriggerRegisterFrameEvent(TasItemShopUI.TriggerUndo, frame, FRAMEEVENT_CONTROL_CLICK)
        BlzTriggerRegisterFrameEvent(TasItemShopUI.TriggerClearFocus, frame, FRAMEEVENT_CONTROL_CLICK)
        BlzFrameSetVisible(TasItemShopUI.Frames.BoxUndo, false)
    end

    if ItemShop.canDefuse then
        parent = BlzCreateFrame(ItemShop.boxDefuseFrameName, TasItemShopUI.Frames.BoxSuper, 0, 0)
        BlzFrameSetSize(parent, ItemShop.refButtonSize + ItemShop.boxDefuseBorderGap*2, ItemShop.refButtonSize + ItemShop.boxDefuseBorderGap*2)
        BlzFrameSetPoint(parent, FRAMEPOINT_BOTTOMRIGHT, TasItemShopUI.Frames.BoxSuper, FRAMEPOINT_BOTTOMRIGHT, 0.00, 0.00)
        TasItemShopUI.Frames.BoxDefuse = parent
        TasItemShopUI.Frames.DefuseButton = BlzCreateFrame("TasItemShopCatButton", parent, 0, 0)
        TasItemShopUI.Frames.DefuseButtonIcon = BlzGetFrameByName("TasItemShopCatButtonBackdrop", 0)
        TasItemShopUI.Frames.DefuseButtonIconPushed = BlzGetFrameByName("TasItemShopCatButtonBackdropPushed", 0)
        TasItemShopUI.Frames.DefuseButtonIconDisabled = BlzGetFrameByName("TasItemShopCatButtonBackdropDisabled", 0)
        TasItemShopUI.Frames.DefuseText = CreateSimpleTooltip(TasItemShopUI.Frames.DefuseButton, ItemShop.textDefuse)
         
        BlzFrameSetTexture(TasItemShopUI.Frames.DefuseButtonIcon, ItemShop.DefuseButtonIcon, 0, false)
        BlzFrameSetTexture(TasItemShopUI.Frames.DefuseButtonIconPushed, ItemShop.DefuseButtonIcon, 0, false)
        BlzFrameSetTexture(TasItemShopUI.Frames.DefuseButtonIconDisabled, ItemShop.DefuseButtonIconDisabled, 0, false)
        frame = TasItemShopUI.Frames.DefuseButton
        BlzFrameSetSize(frame, ItemShop.refButtonSize, ItemShop.refButtonSize)
        BlzFrameSetPoint(frame, FRAMEPOINT_CENTER, parent, FRAMEPOINT_CENTER, 0, 0)
        BlzTriggerRegisterFrameEvent(TasItemShopUI.TriggerDefuse, frame, FRAMEEVENT_CONTROL_CLICK)
        BlzTriggerRegisterFrameEvent(TasItemShopUI.TriggerClearFocus, frame, FRAMEEVENT_CONTROL_CLICK)
        --BlzFrameSetVisible(TasItemShopUI.Frames.BoxDefuse, false)
        BlzFrameSetEnable(TasItemShopUI.Frames.DefuseButton, false)

        BlzFrameClearAllPoints(TasItemShopUI.Frames.DefuseText)
        BlzFrameSetPoint(TasItemShopUI.Frames.DefuseText, FRAMEPOINT_BOTTOMRIGHT, TasItemShopUI.Frames.DefuseButton, FRAMEPOINT_TOPRIGHT, 0, 0.008)
    end
    if ItemShop.canSellItems then
        parent = BlzCreateFrame(ItemShop.boxDefuseFrameName, TasItemShopUI.Frames.BoxSuper, 0, 0)
        BlzFrameSetSize(parent, ItemShop.refButtonSize + ItemShop.boxSellBorderGap*2, ItemShop.refButtonSize + ItemShop.boxSellBorderGap*2)
        if ItemShop.canDefuse then      
            BlzFrameSetPoint(parent, FRAMEPOINT_BOTTOMRIGHT, TasItemShopUI.Frames.BoxDefuse, FRAMEPOINT_BOTTOMLEFT, 0.00, 0.00)
        else
            BlzFrameSetPoint(parent, FRAMEPOINT_BOTTOMRIGHT, TasItemShopUI.Frames.BoxSuper, FRAMEPOINT_BOTTOMRIGHT, 0.00, 0.00)
        end

        TasItemShopUI.Frames.BoxSell = parent
        TasItemShopUI.Frames.SellButton = BlzCreateFrame("TasItemShopCatButton", parent, 0, 0)
        TasItemShopUI.Frames.SellButtonIcon = BlzGetFrameByName("TasItemShopCatButtonBackdrop", 0)
        TasItemShopUI.Frames.SellButtonIconDisabled = BlzGetFrameByName("TasItemShopCatButtonBackdropDisabled", 0)
        TasItemShopUI.Frames.SellButtonIconPushed = BlzGetFrameByName("TasItemShopCatButtonBackdropPushed", 0)
        TasItemShopUI.Frames.SellText = CreateSimpleTooltip(TasItemShopUI.Frames.SellButton, ItemShop.textSell)

        BlzFrameSetTexture(TasItemShopUI.Frames.SellButtonIcon, ItemShop.SellButtonIcon, 0, false)
        BlzFrameSetTexture(TasItemShopUI.Frames.SellButtonIconPushed, ItemShop.SellButtonIcon, 0, false)
        BlzFrameSetTexture(TasItemShopUI.Frames.SellButtonIconDisabled, ItemShop.SellButtonIconDisabled, 0, false)
        frame = TasItemShopUI.Frames.SellButton
        BlzFrameSetSize(frame, ItemShop.refButtonSize, ItemShop.refButtonSize)
        BlzFrameSetPoint(frame, FRAMEPOINT_CENTER, parent, FRAMEPOINT_CENTER, 0, 0)
        BlzTriggerRegisterFrameEvent(TasItemShopUI.TriggerSell, frame, FRAMEEVENT_CONTROL_CLICK)
        BlzTriggerRegisterFrameEvent(TasItemShopUI.TriggerClearFocus, frame, FRAMEEVENT_CONTROL_CLICK)
        BlzFrameSetEnable(TasItemShopUI.Frames.SellButton, false)
        
        BlzFrameClearAllPoints(TasItemShopUI.Frames.SellText)
        BlzFrameSetPoint(TasItemShopUI.Frames.SellText, FRAMEPOINT_BOTTOMRIGHT, TasItemShopUI.Frames.SellButton, FRAMEPOINT_TOPRIGHT, 0, 0.008)
    end
    

    parent = BlzCreateFrameByType("BUTTON", "TasRightClickSpriteParent", TasItemShopUI.Frames.BoxSuper, "", 0)
    BlzFrameSetLevel(parent, 99)
    frame = BlzCreateFrameByType("SPRITE", "TasRightClickSprite", parent, "", 0)
    BlzFrameSetSize(frame, ItemShop.refButtonSize, ItemShop.refButtonSize)
    BlzFrameSetScale(frame, ItemShop.spriteScale)
    BlzFrameSetModel(frame, ItemShop.spriteModel, 0)   
    BlzFrameSetVisible(parent, false)
    TasItemShopUI.Frames.SpriteParent = parent
    TasItemShopUI.Frames.Sprite = frame  
    if ItemShop.LayoutType == 1 then

    elseif ItemShop.LayoutType == 2 then
        ItemShop.ySize = ItemShop.ySize - ItemShop.refButtonBoxSizeY*#refRows
        BlzFrameSetSize(TasItemShopUI.Frames.ParentSuperUI, ItemShop.xSize, ItemShop.ySize)
        BlzFrameSetPoint(refRows[1][2], FRAMEPOINT_TOPRIGHT, TasItemShopUI.Frames.ParentSuperUI, FRAMEPOINT_BOTTOMRIGHT, 0, 0)
    elseif ItemShop.LayoutType == 3 then
        ItemShop.ySize = ItemShop.ySize - ItemShop.refButtonBoxSizeY*#refRows
        BlzFrameSetSize(TasItemShopUI.Frames.ParentSuperUI, ItemShop.xSize, ItemShop.ySize)
        BlzFrameSetPoint(refRows[1][2], FRAMEPOINT_TOPRIGHT, TasItemShopUI.Frames.ParentSuperUI, FRAMEPOINT_BOTTOMRIGHT, 0, 0)
        
        
        --MakeRefButtonsCol(box, textFrame, frames)
        MakeRefButtonsCol(TasItemShopUI.Frames.BoxUser, TasItemShopUI.Frames.UserText, TasItemShopUI.Frames.User)
        MakeRefButtonsCol(TasItemShopUI.Frames.BoxInventory, TasItemShopUI.Frames.InventoryText, TasItemShopUI.Frames.Inventory)
        MakeRefButtonsCol(TasItemShopUI.Frames.BoxMaterial, TasItemShopUI.Frames.MaterialText, TasItemShopUI.Frames.Material)
        MakeRefButtonsCol(TasItemShopUI.Frames.BoxUpgrades, TasItemShopUI.Frames.UpgradesText, TasItemShopUI.Frames.Upgrades)

        refRows = {}
        PlaceRefButtonBoxCol(TasItemShopUI.Frames.BoxUser)
        PlaceRefButtonBoxCol(TasItemShopUI.Frames.BoxInventory)
        PlaceRefButtonBoxCol(TasItemShopUI.Frames.BoxMaterial)
        PlaceRefButtonBoxCol(TasItemShopUI.Frames.BoxUpgrades)

        
    end
    BlzFrameSetSize(TasItemShopUI.Frames.ParentSuperUI, ItemShop.xSize, ItemShop.ySize)
    BlzFrameSetVisible(TasItemShopUI.Frames.ParentSuper, false)
end

function ItemShop.TasItemShopUIShow(player, shop, shopperGroup, mainShoper)
    xpcall(function()
    local flag = (shop ~=nil)
    
    if player == GetLocalPlayer() then
        BlzFrameSetVisible(TasItemShopUI.Frames.ParentSuper, flag)
        if flag then
            BlzFrameSetVisible(BlzFrameGetParent(TasItemShopUI.Frames.ParentSuper), true)
        end
    end

    if flag then
        local oldShop = ItemShop.CurrentShop[player]
        local isNewShopType = GetUnitTypeId(oldShop) ~= GetUnitTypeId(shop)
        ItemShop.CurrentShop[player] = shop

        if mainShoper then
            ItemShop.ShoperMain[player] = mainShoper
        elseif shopperGroup then
            ItemShop.ShoperMain[player] = FirstOfGroup(shopperGroup)
        end
        if shopperGroup then
            GroupClear(ItemShop.Shoper[player])
            -- when a group was given
            if string.sub(tostring(shopperGroup), 1, 6) == "group:" then
                BlzGroupAddGroupFast(shopperGroup, ItemShop.Shoper[player])
            end
        end

        GroupAddUnit(ItemShop.Shoper[player], mainShoper)

        local oldSize = TasItemFusion.Player[player].UseAble.Count
        TasItemFusionGetUseableItems(player, ItemShop.Shoper[player], not ItemShop.sharedItems)
        
        if oldSize ~= TasItemFusion.Player[player].UseAble.Count then
            
            ItemShop.CurrentOffSetInventory[player] = 0
        end
        if isNewShopType then
            -- has to unmark buyAble
            local buttonList = TasItemShopUI.ButtonList
            local shopObject = TasItemShopUI.Shops[GetUnitTypeId(shop)]
            ItemShop.BUY_ABLE_ITEMS.Marker[player] = {}
            
            TasButtonListClearData(buttonList, player)
            -- has custom Shop Data?
            if shopObject then
                -- WhiteListMode?
                if shopObject.Mode then
                    for i, v in ipairs(shopObject) do
                        TasButtonListAddData(buttonList, v, player)
                        ItemShop.BUY_ABLE_ITEMS.Marker[player][v] = true
                    end
                else
                    -- BlackListMode
                    for i, v in ipairs(ItemShop.BUY_ABLE_ITEMS) do
                        if type(v) == "string" then
                            if not shopObject[FourCC(v)] then
                                TasButtonListAddData(buttonList, FourCC(v), player)
                                ItemShop.BUY_ABLE_ITEMS.Marker[player][FourCC(v)] = true
                            end
                        elseif type(v) == "number" then
                            if not shopObject[v] then
                                TasButtonListAddData(buttonList, v, player)
                                ItemShop.BUY_ABLE_ITEMS.Marker[player][v] = true
                            end
                        end
                    end
                end
            else
                -- none custom Shop, add all data.
                for i, v in ipairs(ItemShop.BUY_ABLE_ITEMS) do
                    if type(v) == "string" then
                        ItemShop.BUY_ABLE_ITEMS.Marker[player][FourCC(v)] = true
                        TasButtonListAddData(buttonList, FourCC(v), player)
                    elseif type(v) == "number" then
                        TasButtonListAddData(buttonList, v, player)
                        ItemShop.BUY_ABLE_ITEMS.Marker[player][v] = true
                    end
                end
            end
        end
        if GetLocalPlayer() == player then
            if IsUnitType(ItemShop.ShoperMain[player], UNIT_TYPE_HERO) then
                BlzFrameSetText(TasItemShopUI.Frames.TitelText, GetUnitName(shop) .. " - ".. GetHeroProperName(ItemShop.ShoperMain[player]))
            else
                BlzFrameSetText(TasItemShopUI.Frames.TitelText, GetUnitName(shop) .. " - ".. GetUnitName(ItemShop.ShoperMain[player]))
            end
            
            ItemShop.LocalShopObject = TasItemShopUI.Shops[GetUnitTypeId(shop)]
            if isNewShopType then
                TasButtonListSearch(TasItemShopUI.ButtonList)
            end
        end
        UpdateTasButtonList(TasItemShopUI.ButtonList)
        ItemShop.setSelected(player, TasItemShopUI.Selected[player])
        ItemShop.setSelectedItem(player, TasItemShopUI.SelectedItem[player])
    else
        ItemShop.CurrentShop[player] = nil
        if ItemShop.canUndo then
            -- loop the undo of that player from last to first
            for i = #TasItemShopUI.Undo[player], 1, -1 do
                -- remove all used material
                for _,v in ipairs(TasItemShopUI.Undo[player][i].Items) do
                    SetItemVisible(v[1], true)
                    RemoveItem(v[1])
                end
                
                TasItemShopUI.Undo[player][i].ResultItem = nil
                TasItemShopUI.Undo[player][i].StackChargesGainer = nil
                TasItemShopUI.Undo[player][i] = nil
            end
            if GetLocalPlayer() == player then
                BlzFrameSetVisible(TasItemShopUI.Frames.BoxUndo, false)
            end
            
        end
    end
end, print)
end

function ItemShop.TasItemShopUIShowSimple(player, shop, mainShoper)
    ItemShop.TasItemShopUIShow(player, shop, nil, mainShoper)
end

function ItemShop.ItemShop(current, add, min, max, player)
    local size = math.abs(add)
    if BlzGetTriggerFrameEvent() == FRAMEEVENT_CONTROL_CLICK then
        current = current + add
        if not ItemShop.refButtonPageRotate then
            if current < min then
                current = min
            end
            if current >= max then
                current = max - add
            end
        else
            if add > 0 then
                if current >= max then
                    current = min
                end
            else
                if current < min then
                    local remain = ModuloInteger(max, size)
                    -- last page is incomplete?
                    if remain > 0 then
                        current = max - remain
                    else
                        current = max - size
                    end
                end
            end
        end
    elseif IsRightClick(player) then
        StartSoundForPlayerBJ(player, ToggleIconButton.Sound)
        -- right clicks jump to the first or last Page
        if add > 0 then
            current = max - size
        else
            current = min
        end
    end
    
    return current
end

function ItemShop.RefButtonAction(itemCode)
    local player = GetTriggerPlayer()
    local frame = BlzGetTriggerFrame()

    if BlzGetTriggerFrameEvent() == FRAMEEVENT_CONTROL_CLICK then
    -- print(GetPlayerName(player), "Clicked Material", index)
        ItemShop.setSelected(player, itemCode)
    else
        if IsRightClick(player) then
            ItemShop.ShowSprite(frame, player)
            StartSoundForPlayerBJ(player, ToggleIconButton.Sound)
            ItemShop.BuyItem(player, itemCode)
        end
    end
end


do
    local real = MarkGameStarted
function MarkGameStarted()
    real()
xpcall(function()
    TasItemShopUI.IsReforged = (GetLocalizedString("REFORGED") ~= "REFORGED")
    local function CreateTriggerEx(action)
        local trigger = CreateTrigger()
        TriggerAddAction(trigger, action)
        return trigger
    end

    TasItemShopUI.TriggerClearButton = CreateTriggerEx(function()
        local player = GetTriggerPlayer()
        if player == GetLocalPlayer() then
            BlzFrameSetText(TasItemShopUI.ButtonList.InputFrame, "")
        end
    end)

    TasItemShopUI.TriggerClearFocus = CreateTriggerEx(function()
        local frame = BlzGetTriggerFrame()
        if GetTriggerPlayer() == GetLocalPlayer() then
            BlzFrameSetEnable(frame, false)
            BlzFrameSetEnable(frame, true)
        end
        frame = nil
    end)

    TasItemShopUI.TriggerBuy = CreateTriggerEx(function()
        local player = GetTriggerPlayer()
        local itemCode = TasItemShopUI.Selected[player]
        ItemShop.ShowSprite(BlzGetTriggerFrame(), player)
        ItemShop.BuyItem(player, itemCode)
    end)

    TasItemShopUI.TriggerMaterial = CreateTriggerEx(function()
        local player = GetTriggerPlayer()
        local itemCode = TasItemShopUI.Selected[player]
        local index = tonumber(BlzFrameGetText(BlzGetTriggerFrame())) + ItemShop.CurrentOffSetMaterial[player]
        ItemShop.RefButtonAction(TasItemFusion.BuiltWay[itemCode].Mats[index])

    end)

    TasItemShopUI.TriggerMaterialPage = CreateTriggerEx(function()
        local player = GetTriggerPlayer()
        local itemCode = TasItemShopUI.Selected[player]
        local max = #TasItemFusion.BuiltWay[itemCode].Mats
        local min = 0
        local add = TasItemShopUI.Frames[BlzGetTriggerFrame()]
        
        ItemShop.CurrentOffSetMaterial[player] = ItemShop.ItemShop(ItemShop.CurrentOffSetMaterial[player], add, min, max, player)
        if GetLocalPlayer() == player then
            ItemShop.updateRefButtons(TasItemFusion.BuiltWay[itemCode].Mats, TasItemShopUI.Frames.BoxMaterial, TasItemShopUI.Frames.Material, ItemShop.CurrentOffSetMaterial[player])
            ItemShop.updateHaveMats(player, itemCode)
        end
    end)

    TasItemShopUI.TriggerUpgrade = CreateTriggerEx(function()
        local player = GetTriggerPlayer()
        local itemCode = TasItemShopUI.Selected[player]
        local index = tonumber(BlzFrameGetText(BlzGetTriggerFrame())) + ItemShop.CurrentOffSetUpgrade[player]
        ItemShop.RefButtonAction(TasItemFusion.UsedIn[itemCode][index].Result)
    end)

    

    TasItemShopUI.TriggerUpgradePage = CreateTriggerEx(function()
        local player = GetTriggerPlayer()
        local itemCode = TasItemShopUI.Selected[player]
        local max = #TasItemFusion.UsedIn[itemCode]
        local min = 0
        local add = TasItemShopUI.Frames[BlzGetTriggerFrame()]
        
        ItemShop.CurrentOffSetUpgrade[player] = ItemShop.ItemShop(ItemShop.CurrentOffSetUpgrade[player], add, min, max, player)
        if GetLocalPlayer() == player then
            ItemShop.updateRefButtons(TasItemFusion.UsedIn[itemCode], TasItemShopUI.Frames.BoxUpgrades, TasItemShopUI.Frames.Upgrades, ItemShop.CurrentOffSetUpgrade[player])
        end
    end)

    TasItemShopUI.TriggerQuickLink = CreateTriggerEx(function()
        local player = GetTriggerPlayer()
        local index = tonumber(BlzFrameGetText(BlzGetTriggerFrame())) + ItemShop.CurrentOffSetQuickLink[player]
        local itemCode = TasItemShopUI.QuickLink[player][index]
        if TasItemShopUI.QuickLinkKeyActive[player] and BlzGetTriggerFrameEvent() == FRAMEEVENT_CONTROL_CLICK then
            TasItemShopUI.SetQuickLink(player, itemCode)
        else
            ItemShop.RefButtonAction(itemCode)
        end
        
    end)

    TasItemShopUI.TriggerQuickLinkPage = CreateTriggerEx(function()
        local player = GetTriggerPlayer()
        local max = #TasItemShopUI.QuickLink[player]
        local min = 0
        local add = TasItemShopUI.Frames[BlzGetTriggerFrame()]
        
        ItemShop.CurrentOffSetQuickLink[player] = ItemShop.ItemShop(ItemShop.CurrentOffSetQuickLink[player], add, min, max, player)
        if GetLocalPlayer() == player then
            ItemShop.updateRefButtons(TasItemShopUI.QuickLink[player], TasItemShopUI.Frames.BoxQuickLink, TasItemShopUI.Frames.QuickLink, ItemShop.CurrentOffSetQuickLink[player])
        end          
    end)

    TasItemShopUI.TriggerInventory = CreateTriggerEx(function()
        local player = GetTriggerPlayer()
        local frame = BlzGetTriggerFrame()
        local index = tonumber(BlzFrameGetText(frame)) + ItemShop.CurrentOffSetInventory[player]
        local item
        if ItemShop.inventoryShowMainOnly then
            -- warcraft inventory starts with 0 but button indexes with 1
            item = UnitItemInSlot(ItemShop.ShoperMain[player], index - 1)
        else
            item = TasItemFusion.Player[player].UseAble[index]
        end
        local itemCode = GetItemTypeId(item)
        
        -- prevent a possible desync when the inventory item was not given to TasItemCost yet. TasItemCost creates and destroys an item when a new type is given.
        TasItemCaclCost(itemCode)

        if BlzGetTriggerFrameEvent() == FRAMEEVENT_CONTROL_CLICK then
        -- print(GetPlayerName(player), "Clicked Material", index)
            ItemShop.setSelected(player, itemCode)
            ItemShop.setSelectedItem(player, item)
        else
            if IsRightClick(player) then
                ItemShop.ShowSprite(frame, player)
                StartSoundForPlayerBJ(player, ToggleIconButton.Sound)
                if ItemShop.canSellItems and ItemShop.inventoryRightClickSell then
                    ItemShop.SellItem(player, item)
                else
                    ItemShop.BuyItem(player, itemCode)
                    ItemShop.setSelectedItem(player, item)
                end
            end
        end
        
    end)

    TasItemShopUI.TriggerInventoryPage = CreateTriggerEx(function()
        local player = GetTriggerPlayer()
        local max = TasItemFusion.Player[player].UseAble.Count
        local min = 0
        local add = TasItemShopUI.Frames[BlzGetTriggerFrame()]
        
        ItemShop.CurrentOffSetInventory[player] = ItemShop.ItemShop(ItemShop.CurrentOffSetInventory[player], add, min, max, player)
        
        if GetLocalPlayer() == player then
            ItemShop.updateRefButtons(TasItemFusion.Player[player].UseAble, TasItemShopUI.Frames.BoxInventory, TasItemShopUI.Frames.Inventory, ItemShop.CurrentOffSetInventory[player])
        end
        
    end)

    

    TasItemShopUI.TriggerUndo = CreateTriggerEx(function()
        
        xpcall(function()
        local player = GetTriggerPlayer()
        if #TasItemShopUI.Undo[player] < 1 then return end
        local undo = table.remove(TasItemShopUI.Undo[player])
        
        --print("Use Undo:",#TasItemShopUI.Undo[player] + 1, GetObjectName(undo.Result))
        AdjustPlayerStateSimpleBJ(player, PLAYER_STATE_RESOURCE_GOLD, undo.Gold)
        AdjustPlayerStateSimpleBJ(player, PLAYER_STATE_RESOURCE_LUMBER, undo.Lumber)

        -- find the result and destroy it, this assumes that the shoper Group not changed since the buying
        for i, v in ipairs(undo.ResultItem) do RemoveItem(v[1]) undo.ResultItem[i][1] = nil end
        
        if undo.StackChargesGainer then
            SetItemCharges(undo.StackChargesGainer, GetItemCharges(undo.StackChargesGainer) - undo.StackCharges)
            undo.StackChargesGainer = nil
        end
        -- show the used material and give them back
        for i,v in ipairs(undo.Items) do
            SetItemVisible(v[1], true)
            UnitAddItem(v[2], v[1])
        end
        ItemShop.TasItemShopUIShow(player, ItemShop.CurrentShop[player])
        if GetLocalPlayer() == player then
            
            if #TasItemShopUI.Undo[GetLocalPlayer()] > 0 then
                BlzFrameSetVisible(TasItemShopUI.Frames.BoxUndo, true)
                ItemShop.updateUndoButton(TasItemShopUI.Undo[player][#TasItemShopUI.Undo[player]].Result, TasItemShopUI.Undo[player][#TasItemShopUI.Undo[player]].ActionName)
            else
                BlzFrameSetVisible(TasItemShopUI.Frames.BoxUndo, false)
            end
        end
    end, print)
    end)

    TasItemShopUI.TriggerSell = CreateTriggerEx(function()
        ItemShop.SellItem(GetTriggerPlayer(), TasItemShopUI.SelectedItem[GetTriggerPlayer()])
    end)

    TasItemShopUI.TriggerDefuse = CreateTriggerEx(function()
        
        xpcall(function()
            
        local player = GetTriggerPlayer()
        if not TasItemShopUI.SelectedItem[player] then return end
        local item = TasItemShopUI.SelectedItem[player]
        local itemCode = GetItemTypeId(item)
        TasItemShopUI.SelectedItem[player] = nil
        
        local gold, lumber = TasItemGetCost(itemCode)
        local gold2, lumber2
        for i, v in ipairs(TasItemFusion.BuiltWay[itemCode].Mats) do
            gold2, lumber2 = TasItemGetCost(v)
            gold = gold - gold2
            lumber = lumber - lumber2
        end

        AdjustPlayerStateSimpleBJ(player, PLAYER_STATE_RESOURCE_GOLD, gold)
        AdjustPlayerStateSimpleBJ(player, PLAYER_STATE_RESOURCE_LUMBER, lumber)
        local undo
        if ItemShop.canUndo then
            undo = {ResultItem = {}, Result = itemCode, Gold = -gold, Lumber = -lumber, Items = {}, ActionName = GetLocalizedString(ItemShop.textDefuse)}
            table.insert(TasItemShopUI.Undo[player], undo)
            for i = 0, BlzGroupGetSize(ItemShop.Shoper[player]) - 1, 1 do
                owner = BlzGroupUnitAt(ItemShop.Shoper[player], i)
                if UnitHasItem(owner, item) then
                    UnitRemoveItem(owner, item)
                    SetItemVisible(item, false)
                    undo.Items[1] = {item, owner}
                    break
                end
            end
            
            if GetLocalPlayer() == player then
                BlzFrameSetVisible(TasItemShopUI.Frames.BoxUndo, true)
                ItemShop.updateUndoButton(undo.Result, GetLocalizedString(ItemShop.textDefuse))
            end
        else
            RemoveItem(item)
        end

        for i, v in ipairs(TasItemFusion.BuiltWay[itemCode].Mats) do
            item = CreateItem(v, GetUnitX(ItemShop.ShoperMain[player]), GetUnitY(ItemShop.ShoperMain[player]))
            ItemShop.GiveItemGroup(player, item, undo)
        end
        
        if GetLocalPlayer() == player then
            --BlzFrameSetVisible(TasItemShopUI.Frames.BoxDefuse, false)
            BlzFrameSetEnable(TasItemShopUI.Frames.DefuseButton, false)
        end
    end, print)
    end)
    
    local tempGroup = CreateGroup()
    local function ShopSelectionAction(player, shop, target)
        xpcall(function()
        -- is a registered shop UnitType?
        if TasItemShopUI.Shops[GetUnitTypeId(shop)] then
            local range = TasItemShopUI.Shops[GetUnitTypeId(shop)].Range
            if not range then range = ItemShop.shopRange end
            GroupEnumUnitsInRange(tempGroup, GetUnitX(shop), GetUnitY(shop), range + 400, nil)
            -- remove unallowed shoppers
            
            ForGroup(tempGroup, function()
                if not ItemShop.IsValidShopper(player, shop, GetEnumUnit(), range) then
                    GroupRemoveUnit(tempGroup, GetEnumUnit())
                end
            end)
            if not target and IsUnitInGroup(ItemShop.ShoperMain[player], tempGroup) then
                target = ItemShop.ShoperMain[player]
            end
            
            ItemShop.TasItemShopUIShow(player, shop, tempGroup, target)
        -- no, end shopping!
        elseif ItemShop.CurrentShop[player] then
            ItemShop.TasItemShopUIShow(player)
        end
    end, print)
    end
    TasItemShopUI.TriggerSelect = CreateTriggerEx(function()
        ShopSelectionAction(GetTriggerPlayer(), GetTriggerUnit())
    end)
    TriggerRegisterAnyUnitEventBJ(TasItemShopUI.TriggerSelect, EVENT_PLAYER_UNIT_SELECTED)

    if ItemShop.userButtonOrder then
        TasItemShopUI.TriggerOrder = CreateTriggerEx(function()
            if TasItemShopUI.Shops[GetUnitTypeId(GetTriggerUnit())] then
                ShopSelectionAction(GetOwningPlayer(GetOrderTargetUnit()), GetTriggerUnit(), GetOrderTargetUnit())
            end
        end)
        TriggerRegisterAnyUnitEventBJ(TasItemShopUI.TriggerOrder, EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER)
    end

    TasItemShopUI.TriggerUser = CreateTriggerEx(function()
        local frame = BlzGetTriggerFrame()
        local player = GetTriggerPlayer()
        local index = tonumber(BlzFrameGetText(BlzGetTriggerFrame())) + ItemShop.CurrentOffSetUser[player]
        local unit = BlzGroupUnitAt(ItemShop.Shoper[player], index - 1)

        if BlzGetTriggerFrameEvent() == FRAMEEVENT_CONTROL_CLICK then
            if not ItemShop.userButtonOrder then
                ShopSelectionAction(player, ItemShop.CurrentShop[player], unit)
            end
            IssueNeutralTargetOrder(player, ItemShop.CurrentShop[player], "smart", unit)
        else
            if IsRightClick(player) then
                SelectUnitForPlayerSingle(unit, player)
            end
        end
    end)

    TasItemShopUI.TriggerUserPage = CreateTriggerEx(function()
        local player = GetTriggerPlayer()
        local max = BlzGroupGetSize(ItemShop.Shoper[player])
        local min = 0
        local add = TasItemShopUI.Frames[BlzGetTriggerFrame()]
        ItemShop.CurrentOffSetUser[player] = ItemShop.ItemShop(ItemShop.CurrentOffSetUser[player], add, min, max, player)
        
        if GetLocalPlayer() == player then
            ItemShop.updateRefButtons(ItemShop.Shoper[player], TasItemShopUI.Frames.BoxUser, TasItemShopUI.Frames.User, ItemShop.CurrentOffSetUser[player])
            ItemShop.updateOverLayMainSelected(player)
        end
        
    end)

    TasItemShopUI.TriggerESC = CreateTriggerEx(function()
        ItemShop.TasItemShopUIShow(GetTriggerPlayer())
    end)

    TasItemShopUI.TriggerScrollParent = CreateTriggerEx(function()
        local frame = TasItemShopUI.ButtonList.Slider
        if GetLocalPlayer() == GetTriggerPlayer() then
            if BlzGetTriggerFrameValue() > 0 then
                BlzFrameSetValue(frame, BlzFrameGetValue(frame) + TasItemShopUI.ButtonList.SliderStep)
            else
                BlzFrameSetValue(frame, BlzFrameGetValue(frame) - TasItemShopUI.ButtonList.SliderStep)
            end
        end
    end)

    TasItemShopUI.TriggerCategoryMode = CreateTriggerEx(function()
        if GetTriggerPlayer() == GetLocalPlayer() then
            TasButtonListSearch(TasItemShopUI.ButtonList)
        end
    end)

    TasItemShopUI.TriggerPressShift = CreateTriggerEx(function()
        --print("Hold Shift")
        TasItemShopUI.QuickLinkKeyActive[GetTriggerPlayer()] = true
        if ItemShop.refButtonCountQuickLink > 0 and GetTriggerPlayer() == GetLocalPlayer() then
            BlzFrameSetVisible(TasItemShopUI.Frames.QuickLinkHighLight, true)
        end
    end)
    TasItemShopUI.TriggerReleaseShift = CreateTriggerEx(function()
        --print("Release Shift")
        TasItemShopUI.QuickLinkKeyActive[GetTriggerPlayer()] = false
        if ItemShop.refButtonCountQuickLink > 0 and GetTriggerPlayer() == GetLocalPlayer() then
            BlzFrameSetVisible(TasItemShopUI.Frames.QuickLinkHighLight, false)
        end
    end)
    

    local tempUnits = {Count = 0}
    TimerStart(CreateTimer(), ItemShop.updateTime, true, function()
      --  xpcall(function()
      if ItemShop.posScreenRelative then
        --credits to ScrewTheTrees(Fred) & Niklas
        BlzFrameSetSize(TasItemShopUI.Frames.Fullscreen, BlzGetLocalClientWidth()/BlzGetLocalClientHeight()*0.6, 0.6)
      end
        local player, unit
        for i = 0, bj_MAX_PLAYER_SLOTS - 1 do
            player = Player(i)
            
            if ItemShop.CurrentShop[player] then
                ShopSelectionAction(player, ItemShop.CurrentShop[player])
            end
        end
    --end, print)
    end)
    --call the function handling custom User setup
    xpcall(UserInit, print)
    --precalc any added Item
    for i = 1, #ItemShop.BUY_ABLE_ITEMS do
       -- if type(ItemShop.BUY_ABLE_ITEMS[i]) == "string" then ItemShop.BUY_ABLE_ITEMS[i] = FourCC(ItemShop.BUY_ABLE_ITEMS[i]) end
        TasItemCaclCost(ItemShop.BUY_ABLE_ITEMS[i])
    end
    

    local player
    ItemShop.BUY_ABLE_ITEMS.Marker = {}
    for i = 0, bj_MAX_PLAYER_SLOTS - 1 do
        player = Player(i)
        ItemShop.Shoper[player] = CreateGroup()
        TasItemShopUI.Undo[player] = {}
        ItemShop.BUY_ABLE_ITEMS.Marker[player] = {}
        TriggerRegisterPlayerEventEndCinematic(TasItemShopUI.TriggerESC, player)
        TasItemShopUI.QuickLink[player] = {}
        if ItemShop.quickLinkKey then
            --"none"(0), "shift"(1), "control"(2), "alt"(4) and "META"(8) (windows key)
            --1 + 2 + 4 + 8 = 15
            for meta = 0, 15 do
                BlzTriggerRegisterPlayerKeyEvent(TasItemShopUI.TriggerPressShift, player, ItemShop.quickLinkKey, meta, true)
                BlzTriggerRegisterPlayerKeyEvent(TasItemShopUI.TriggerReleaseShift, player, ItemShop.quickLinkKey, meta, false)
            end
        end
    end

    TasItemShopUI.Create()
    -- Frame related code actions are not saved/Loaded, probably repeat them after Loading the game
    if FrameLoaderAdd then FrameLoaderAdd(TasItemShopUI.Create) end
    
end, print)
end

end