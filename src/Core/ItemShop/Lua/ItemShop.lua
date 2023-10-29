--[[ TasItemShopV4g by Tasyen
TasItemSetCategory(itemCode, category)
TasItemShopAdd(itemCode, category)
TasItemShopAddCategory(icon, text)
 define a new Category, should be done before the UI is created.
 Returns the value of the new category
TasItemShopUIShow(player, shop, shopperGroup[, mainShoper])
    TasItemShopUIShow(player) hides the shop for player
    shopperGroup are all units providing items, if you use nil the current shoppergroup remains intact. When giving something else the group contains only mainShoper.
    mainShoper is the unit consider for haggel and gains the items. If you gave a group then you can skip mainShoper then a random is taken.
    with player and shop the shoppers are kept but the shop updates.
    Beaware that this System does only update on user input it will not check distance/live or anything.
TasItemShopUIShowSimple(player, shop, mainShoper)
TasItemShopCreateShop(unitCode, whiteList, goldFactor, lumberFactor, goldFunction, lumberFunction)
TasItemShopAddShop(unitCode, ...)
 adds data for that specific shop
TasItemShopGoldFactor(unitCode, factor, ...)
    sets the goldFactor for that shop to the given data
TasItemShopLumberFactor(unitCode, factor, ...)
    lumberFactor ^^
TasItemShopAddHaggleSkill(skill, goldBase[, lumberBase, goldAdd, lumberAdd])
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
        -- it is more practically to use function TasItemShopAddCategory(icon, text) inside UserInit()
        -- Icon path, tooltip Text (tries to localize)
    }
}

do
    -- A list of items buyable, you could just smack in all your buyAble TasItems here.
    -- Or use TasItemShopAdd(itemCode, category) inside local function UserInit()
    -- This List is used by shops without custom data or by BlackList Shops
    local BUY_ABLE_ITEMS = {}
    
    local Haggle_Skills = {
        -- skill, GoldBase, Lumberbase, GoldAdd, LumberAdd
        -- add is added per Level of that skill to Base. The current Cost is than multiplied by that Factor.
        --{FourCC('A000'), 0.8, 0.8, 0.0, 0.0}
    }
    
    -- position of the custom UI
    -- it can leave the 4:3 Screen but you should checkout the start of function TasItemShopUI.Create
    local xPos = -0.2
    local yPos = -0.02
    local posPoint = FRAMEPOINT_TOPRIGHT
    local posScreenRelative = true --(true) repos to the screenSize, when the resolution mode changes the box will move further in/out when using a right or Left point.
    -- It is advised to posScreenRelative = false when posPoint does not include Left or Right
    -- with posScreenRelative = false xPos and yPos are abs coords, to which posPoint of the Shop UI is placed to.

    -- position of Item toolTips, this does not affect the tooltips for Categories or Users.
    -- comment out toolTipPosPointParent, if you want a specific position on screen.
    -- with toolTipPosPoint & toolTipPosPointParent are toolTipPosX & toolTipPosY relative offsets.
    -- The position is a bit wierd, the position is not the box but the Extended Tooltip Text, the Header has a height of ~0.052.

    local toolTipPosX = 0.0
    local toolTipPosY = -0.052
    local toolTipPosPoint = FRAMEPOINT_TOPRIGHT
    local toolTipPosPointParent = FRAMEPOINT_BOTTOMRIGHT
    local toolTipSizeX = 0.2 -- only content
    local toolTipSizeXBig = 0.3 -- only content
    local toolTipLimitBig = 300 -- When a TooltipText Contains this amount or more of Chars it will use toolTipSizeXBig
    
    -- this can be used to change the visual ("EscMenuControlBackdropTemplate") ("TasItemShopRaceBackdrop")
    local boxFrameName = "TasItemShopRaceBackdrop"
    local boxButtonListFrameName = "EscMenuControlBackdropTemplate"
    local boxRefFrameName = "EscMenuControlBackdropTemplate"
    local boxCatFrameName = "EscMenuControlBackdropTemplate"
    local boxUndoFrameName = "TasItemShopRaceBackdrop"
    local boxDefuseFrameName = "TasItemShopRaceBackdrop"
    local buttonListHighLightFrameName = "TasItemShopSelectedHighlight"
    local boxFrameBorderGap = 0.0065
    local boxButtonListBorderGap = 0.0065 -- does nothing right now
    local boxRefBorderGap = 0.0065
    local boxCatBorderGap = 0.0055
    local boxUndoBorderGap = 0.0045
    local boxDefuseBorderGap = 0.0045
    local boxSellBorderGap = 0.0045
    local buttonListButtonGapCol = 0.001
    local buttonListButtonGapRow = 0.005
    -- material control
    local flexibleShop = false -- (true) can sell items not added to the shop. This includes items reached over RefButtons and material for autocompletion. I don't know that item, but your description is enough. I craft it, no problem.
    local sharedItems = false -- (false) can only fuse material owned by neutral passive (default) or oneself. The code handling that is in TasItemFusion.
    local canProviderGetItem = true -- (true) when the mainShopper's inventory is full, try to give the other matieral provider the item
    local canUndo = true -- (true) There is an Undo Button which allows to Revert BuyActions done in this shopping. A shopping ends when the UI is closed, changing current shop counts as closed.
    local canDefuse = true -- (true) There is a Defuse Button which allows to defuse FusionItems hold.
    local DefuseButtonIcon = "ReplaceableTextures\\CommandButtons\\BTNdemolish"
    local DefuseButtonIconDisabled = getDisabledIcon(DefuseButtonIcon)
    local canSellItems = true -- (true)
    local SellFactor = 1.0
    local SellUsesCostModifier = true
    local SellButtonIcon = "ReplaceableTextures\\CommandButtons\\BTNReturnGoods"
    local SellButtonIconDisabled = getDisabledIcon(SellButtonIcon)

    local MainUserTexture = "ui\\widgets\\console\\human\\commandbutton\\human-multipleselection-border" 
    local MainItemTexture = "ui\\widgets\\console\\human\\commandbutton\\human-multipleselection-border" 

    local shopRange = 1600 -- the max distance between shop and Shoper, this can be overwritten by shopObject.Range.
    local updateTime = 0.4 -- how many seconds pass before a new update is applied. update: search new shopers, validat current shopers and update UI.
    -- Titel-text in the reference Boxes
    local textUpgrades = "COLON_UPGRADE" --tries to localize on creation
    local textMats = "SCORESCREEN_TAB3"
    local textInventory = "INVENTORY"
    local textUser = "USER"
    local textCanNotBuyPrefix = "Can not buy: "
    local textCanNotBuySufix = "OUTOFSTOCKTOOLTIP"
    local textNoValidShopper = "No valid Shoper"
    local textUndo = "Undo: "
    local textUnBuyable = "xxxxxxx"
    local textDefuse = "Defuse:"
    local textSell = "Sell:"
    local textQuickLink = "ShortCuts:"
    local categoryModeTextAnd = "ui\\widgets\\battlenet\\bnet-mainmenu-friends-disabled"
    local categoryModeTextOr = "Or"
    local categoryModeIconOr = "ui\\widgets\\battlenet\\bnet-mainmenu-friends-up"
    local categoryModeIconAnd = "And"

    local quickLinkKey = OSKEY_LSHIFT  -- nil will prevent the user from changing shortcuts. can also be commented out
    -- how many refButtons, refButtons have pages, if needed.
    -- A feature is disabled with a counter smaller than 1.
    local refButtonCountMats = 4 -- materialRefs.
    local refButtonCountUp = 4 -- possible upgrades of the current Selected
    local refButtonCountInv = 6 -- inventory items, this system allows an unitgroup to provide items, if you don't use that feature only upto 6 makes sense.
    local refButtonCountUser = 6 -- References to the shopping Units/material provider.
    local refButtonCountQuickLink = 4 -- User SelectAble Shortcuts
    local refButtonSize = 0.02
    local refButtonGap = 0.003
    local refButtonPageSize = 0.012
    local refButtonPageRotate = true --(true) swap to first page when going above last page, and swap to last page when going down first Page
    local refButtonPageUp = "ReplaceableTextures\\CommandButtons\\BTNReplay-SpeedUp"
    local refButtonPageDown = "ReplaceableTextures\\CommandButtons\\BTNReplay-SpeedDown"
    local refButtonBoxSizeY = 0.047

    -- LayoutType alters the position of buttons
    -- (0) the buy button is at the bottom between buttonList and buybutton the refBoxes are placed  
    -- (1) the buy button is below the buttonList below it are the refButtons
    -- (2) the buy button is below the buttonList, the RefButtons are at the bottom outside of the Box
    -- (3) the buy button is below the buttonList, the RefButtons are left outside of the Box they are also from top to bottom
    local LayoutType = 0
    

    -- (true) right clicking an refInventoryButton in the UI will sell the item
    -- (false) right clicking it will buy it again.
    local inventoryRightClickSell = true
    local inventoryShowMainOnly = true --(false) show all items currently useable

    local userButtonOrder = false -- (true) Creates any UnitTargetOrder Event enables right clicking Units in the world to swap main shoppers.
    local doubleClickTimeOut = 2.0 -- amount of seconds a doppleclick inside the Buttonlist counts as Buying    

    -- model displayed when buy request was started.
    --local spriteModel = "UI\\Feedback\\GoldCredit\\GoldCredit.mdl" -- in 1.31 the coins are black only.
    --local spriteModel = "Abilities\\Weapons\\RockBoltMissile\\RockBoltMissile.mdl"
    --local spriteModel = "Abilities\\Weapons\\BansheeMissile\\BansheeMissile.mdl"
    --local spriteModel = "Abilities\\Spells\\Other\\GeneralAuraTarget\\GeneralAuraTarget.mdl"
    local spriteModel = "war3mapImported\\BansheeMissile.mdx" --by abfal, (no sound).
    local spriteScale = 0.0006 -- The scale has to fit the used model. if you use non-UI models use a low scale, 0.001 or below.
    local spriteAnimationIndex = 1 -- 1 = death animation

    local buttonListRows = 5
    -- buttonListCols has a strong impact on the xSize of this UI. make sure that refButtons of one type fit into this.
    local buttonListCols = 3

    -- this will not change the size of the Buttons, nor the space the text can take
    -- true = Show
    -- false = hide
    local buttonListShowGold = true
    local buttonListShowLumber = true
    local buyButtonShowGold = true
    local buyButtonShowLumber = true

    -- which button is used inside the ButtonList? Enable one block and disable the other one

    local buttonListButtonName = "TasButtonSmall"
    local buttonListButtonSizeX = 0.1
    local buttonListButtonSizeY = 0.0325

    -- "TasButtonGrid" are smaller, they don't show the names in the list
    --local buttonListButtonName = "TasButtonGrid"
    --local buttonListButtonSizeX = 0.064
    --local buttonListButtonSizeY = 0.0265

    --local buttonListButtonName = "TasButton"
    --local buttonListButtonSizeX = 0.2
    --local buttonListButtonSizeY = 0.0265
    
    local categoryButtonSize = 0.019
    
    -- This runs right before the actually UI is created.
    -- this is a good place to add items, categories, fusions shops etc.
    local function UserInit()
        -- this can all be done in GUI aswell, enable the next Line or remove all Text of this function if you only want to use GUI
        --if true then return end

        -- define Categories: Icon, Text
        -- the Categories are displayed in the order added.
        -- it is a good idea to save the returned Value in a local to make the category setup later much easier to understand.
        -- you can only have 31 categories
        TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNStaffOfSilence", "Active")
        TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNCommand", "Passive")

        TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNGauntletsOfOgrePower", "STRENGTH")
        TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNSlippersOfAgility", "AGILITY")
        TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNMantleOfIntelligence", "INTELLIGENCE")
        
        TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNSteelMelee", "Attack")
        TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNHumanArmorUpOne", "COLON_ARMOR")

        TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNWallOfFire", "Offensive")
        TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNDefend", "Defensive")

        TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNStun", "Crowd Control")
        TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNSentryWard", "Utility")
        TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNBootsOfSpeed", "COLON_MOVE_SPEED")

        TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNRegenerate", "LifeRegeneration")
        TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNManaStone", "ManaRegeneration")
        -- local catDmg = TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNSteelMelee", "COLON_DAMAGE")
        -- local catArmor = TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNHumanArmorUpOne", "COLON_ARMOR")
        -- local catStr = TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNGauntletsOfOgrePower", "STRENGTH")
        -- local catAgi = TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNSlippersOfAgility", "AGILITY")
        -- local catInt = TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNMantleOfIntelligence", "INTELLECT")
        -- local catLife = TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNPeriapt", "Life")
        -- local catLifeReg = TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNRegenerate", "LifeRegeneration")
        -- local catMana = TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNPendantOfMana", "Mana")
        -- local catManaReg = TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNSobiMask", "ManaRegeneration")
        -- local catOrb = TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNOrbOfDarkness", "Orb")
        -- local catAura = TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNLionHorn", "Aura")
        -- local catActive = TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNStaffOfSilence", "Active")
        -- local catPower = TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNControlMagic", "SpellPower")
        -- local catCooldown = TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNHumanMissileUpOne", "Cooldown")
        -- local catAtkSpeed = TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNHumanMissileUpOne", "Attackspeed")
        -- local catMress = TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNRunedBracers", "Magic-Resistence")
        -- local catConsum = TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNPotionGreenSmall", "ConsumAble")
        -- local catMoveSpeed = TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNBootsOfSpeed", "COLON_MOVE_SPEED")
        -- local catCrit = TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNCriticalStrike", "Crit")
        -- local catLifeSteal = TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNVampiricAura", "Lifesteal")
        -- local catEvade = TasItemShopAddCategory("ReplaceableTextures\\CommandButtons\\BTNEvasion", "Evasion")
        
        -- setup custom shops
        -- custom Shops are optional.
        -- They can have a White or Blacklist of items they can(n't) sell and have a fixed cost modifier for Gold, Lumber aswell as a function for more dynamic things for Gold and Lumber.
        -- local shopObject
        -- -- 'n000' can only sell this items (this items don't have to be in the pool of items)
        -- shopObject = TasItemShopAddShop('n01P', 'hlst', 'mnst', 'pghe', 'pgma', 'pnvu', 'pres', 'ankh', 'stwp', 'shas', 'I004', 'I006')
        -- -- enable WhiteListMode
        -- shopObject.Mode = true
        -- -- 'n001' can't sell this items (from the default pool of items)
        -- shopObject = TasItemShopAddShop('n001', 'hlst', 'mnst', 'pghe', 'pgma', 'pnvu', 'pres', 'ankh', 'stwp', 'shas')
        -- -- enable BlackListMode
        -- shopObject.Mode = false
        -- -- create an shopObject for 'ngme', has to pay 20% more than normal, beaware that this can be overwritten by GUI Example
        -- shopObject = TasItemShopCreateShop('ngme', false, 1.2, 1.2
        -- -- custom gold Cost function
        --     ,function(itemCode, cost, client, shop) return cost end
        -- -- custom lumber Cost function
        --     ,function(itemCode, cost, client, shop) return cost end
        -- )
        -- --'I002' crown +100 was never added to the database but this shop can craft/sell it.
        -- shopObject = TasItemShopAddShop('n002', 'ckng', 'I001', 'I002', 'arsh')
        -- shopObject.Mode = true
        

        -- Define skills/Buffs that change the costs in the shop
        -- cursed Units have to pay +25%
        -- TasItemShopAddHaggleSkill(FourCC('Bcrs'), 1.25, 1.25)

        -- define Fusions
        -- result created by 'xxx', 'xx' , 'x'...
        -- item can only be crafted by one way
        -- can add any amount of material in the Lua version
        -- TasItemFusionAdd('bgst', 'rst1', 'rst1')
        -- TasItemFusionAdd('ciri', 'rin1', 'rin1')
        -- TasItemFusionAdd('belv', 'rag1', 'rag1')
        -- TasItemFusionAdd('hval', 'rag1', 'rst1')
        -- TasItemFusionAdd('hcun', 'rag1', 'rin1')
        -- TasItemFusionAdd('mcou', 'rst1', 'rin1')
        -- TasItemFusionAdd('ckng', 'cnob', 'cnob')
        -- TasItemFusionAdd('rat9', 'rat6', 'rat6')
        -- TasItemFusionAdd('ratf', 'rat9', 'rat9')
        -- TasItemFusionAdd('rde4', 'rde3')
        -- TasItemFusionAdd('rde3', 'rde2')
        -- TasItemFusionAdd('rhth', 'prvt')
        -- TasItemFusionAdd('pmna', 'penr')
        -- TasItemFusionAdd('arsh', 'rde3', 'rde2')

        -- TasItemFusionAdd('lhst', 'sfog')

        -- -- crown of Kings + 50
        -- TasItemFusionAdd('I001', 'ckng', 'ckng', 'ckng', 'ckng', 'ckng', 'ckng', 'bgst', 'bgst', 'ciri', 'ciri', 'belv', 'belv', 'cnob', 'cnob')
        -- -- crown of Kings + 100, this is a joke you can not craft it because it was not added to buyAble Items
        -- TasItemFusionAdd('I002', 'I001', 'I001')

        -- -- define item Categories
        -- -- uses the locals from earlier.
        -- -- An item can have multiple categories just add them together like this: catStr + catAgi + catInt
        
        -- TasItemSetCategory('rst1', catStr)
        -- TasItemSetCategory('bgst', catStr)
        -- TasItemSetCategory('rin1', catInt)
        -- TasItemSetCategory('ciri', catInt)
        -- TasItemSetCategory('rag1', catAgi)
        -- TasItemSetCategory('belv', catAgi)

        -- TasItemSetCategory('I001', catStr + catAgi + catInt)

        -- TasItemSetCategory('ckng', catStr + catAgi + catInt)
        -- TasItemSetCategory('mcou', catStr + catInt)
        -- TasItemSetCategory('hval', catStr + catAgi)
        -- TasItemSetCategory('hcun', catAgi + catInt)
        -- TasItemSetCategory('cnob', catStr + catAgi + catInt)

        -- TasItemSetCategory('rat9', catDmg)
        -- TasItemSetCategory('rat6', catDmg)
        -- TasItemSetCategory('ratf', catDmg)
        
        -- TasItemSetCategory('rlif', catLifeReg)

        -- TasItemSetCategory('ajen', catAura + catAtkSpeed + catMoveSpeed)
        -- TasItemSetCategory('clfm', catAura + catDmg)
        -- TasItemSetCategory('ward', catAura + catDmg)
        -- TasItemSetCategory('kpin', catAura + catManaReg)
        -- TasItemSetCategory('lgdh', catAura + catMoveSpeed + catLifeReg)
        -- TasItemSetCategory('rde4', catArmor)
        -- TasItemSetCategory('pmna', catMana)
        -- TasItemSetCategory('rhth', catLife)
        -- TasItemSetCategory('ssil', catActive)
        -- TasItemSetCategory('lhst', catAura + catArmor)
        -- TasItemSetCategory('afac', catAura + catDmg)
        -- TasItemSetCategory('sbch', catAura + catDmg)
        -- TasItemSetCategory('sbch', catAura + catLifeSteal)
        -- TasItemSetCategory('brac', catMress)
        -- TasItemSetCategory('spsh', catMress + catActive)
        -- TasItemSetCategory('rwiz', catManaReg)
        -- TasItemSetCategory('crys', catActive)
        -- TasItemSetCategory('evtl', catEvade)
        -- TasItemSetCategory('penr', catMana)
        -- TasItemSetCategory('prvt', catLife)
        -- TasItemSetCategory('rde3', catArmor)
        -- TasItemSetCategory('bspd', catMoveSpeed)
        -- TasItemSetCategory('gcel', catAtkSpeed)
        -- TasItemSetCategory('rde2', catArmor)
        -- TasItemSetCategory('clsd', catActive)
        -- TasItemSetCategory('dsum', catActive + catMoveSpeed)
        -- TasItemSetCategory('stel', catActive + catMoveSpeed)
        -- TasItemSetCategory('desc', catActive + catMoveSpeed)
        -- TasItemSetCategory('ofro', catDmg + catOrb)
        -- TasItemSetCategory('modt', catLifeSteal + catOrb)
        -- TasItemSetCategory('thdm', catActive)
        -- TasItemSetCategory('hlst', catActive + catConsum + catLifeReg)
        -- TasItemSetCategory('mnst', catActive + catConsum + catManaReg)
        -- TasItemSetCategory('pghe', catActive + catConsum)
        -- TasItemSetCategory('pgma', catActive + catConsum)
        -- TasItemSetCategory('pnvu', catActive + catConsum)
        -- TasItemSetCategory('pres', catActive + catConsum)
        -- TasItemSetCategory('ankh', catConsum)
        -- TasItemSetCategory('stwp', catActive + catConsum + catMoveSpeed)
        -- TasItemSetCategory('shas', catActive + catConsum + catMoveSpeed)
        -- TasItemSetCategory('ofir', catOrb + catDmg)
        -- TasItemSetCategory('oli2', catOrb + catDmg)
        -- TasItemSetCategory('odef', catOrb + catDmg)
        -- TasItemSetCategory('oven', catOrb + catDmg)
        -- TasItemSetCategory('oslo', catOrb + catDmg)
        -- TasItemSetCategory('ocor', catOrb + catDmg)
        -- TasItemSetCategory('shtm', catActive)
        -- TasItemSetCategory('I004', catActive)
        -- TasItemSetCategory('I006', catActive)
    end
    local function GetParent()
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
    local function IsValidShopper(player, shop, unit, range)
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
    local function CostModifier(gold, lumber, itemCode, buyer, shop, shopObject)
        -- this function is called for each Button that shows costs in the shop UI and right before buying the item.
        -- Beaware that this function is also called in a async manner -> no sideeffects or state changes.
        -- buyer got the Haggling skill?
        local level, skill
        for i, v in ipairs(Haggle_Skills) do
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
    local function GetItemSellCosts(unit, shop, item)
        local itemCode = GetItemTypeId(item)
        local gold, lumber, charges = TasItemGetCost(itemCode)
        gold = gold * SellFactor
        lumber = lumber * SellFactor
        if SellUsesCostModifier then
            gold, lumber = CostModifier(gold, lumber, itemCode, unit, shop, TasItemShopUI.Shops[GetUnitTypeId(shop)])
        end
        if charges > 0 then
            gold = GetItemCharges(item)*gold/charges
            lumber = GetItemCharges(item)*lumber/charges
        end
        return math.floor(gold), math.floor(lumber), charges
    end
    --
    -- system start, touch on your own concern
    --
    -- the unique power2 Values used for categories, shifted by 1
    local CategoryValue = {1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768,65536,131072,262144,524288,1048576,2097152,4194304,8388608,16777216,33554432,67108864,134217728,268435456,536870912,1073741824}
    local function ShowSprite(frame, player)
        if player and GetLocalPlayer() ~= player then return end
        BlzFrameSetVisible(TasItemShopUI.Frames.SpriteParent, true)
        BlzFrameSetModel(TasItemShopUI.Frames.Sprite, spriteModel, 0)
        BlzFrameSetSpriteAnimate(TasItemShopUI.Frames.Sprite, spriteAnimationIndex, 0)
        BlzFrameSetPoint(TasItemShopUI.Frames.Sprite, FRAMEPOINT_CENTER, frame, FRAMEPOINT_CENTER, 0, 0)
    end
    local TasItemCategory = __jarray(0)
    function TasItemSetCategory(itemCode, category)
        if type(itemCode) == "string" then itemCode = FourCC(itemCode) end
        TasItemCategory[itemCode] = category
    end
    function TasItemShopAdd(itemCode, category)
        if type(itemCode) == "string" then itemCode = FourCC(itemCode) end
        TasItemSetCategory(itemCode, category)
        table.insert(BUY_ABLE_ITEMS, itemCode)
        TasItemCaclCost(itemCode)
        if bj_gameStarted then
            
        end
    end
    function TasItemShopAddHaggleSkill(skill, goldBase, lumberBase, goldAdd, lumberAdd)
        if not goldAdd then goldAdd = 0 end
        if not lumberAdd then lumberAdd = 0 end
        if not lumberBase then lumberBase = 1 end
        table.insert(Haggle_Skills, {skill, goldBase, lumberBase, goldAdd, lumberAdd})
    end
    function TasItemShopAddCategory(icon, text)
        if #TasItemShopUI.Categories >= #CategoryValue then print("To many Categories!! new category", text, icon) end
        table.insert(TasItemShopUI.Categories, {icon, text})
        return CategoryValue[#TasItemShopUI.Categories]
    end
    function TasItemShopCreateShop(unitCode, whiteList, goldFactor, lumberFactor, goldFunction, lumberFunction)
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
    TasItemShopCreateShopSimple = TasItemShopCreateShop
    function TasItemShopAddShop(unitCode, ...)
        local shopObject = TasItemShopCreateShop(unitCode)
        for i, v in ipairs({...}) do
            if type(v) == "string" then v = FourCC(v) end
            TasItemCaclCost(v)
            shopObject[v] = true
            --print(GetObjectName(v))
            table.insert(shopObject, v) 
        end
        return shopObject
    end
    function TasItemShopGoldFactor(unitCode, factor, ...)
        local shopObject = TasItemShopCreateShop(unitCode)
        for i, v in ipairs({...}) do
            if type(v) == "string" then v = FourCC(v) end
            shopObject.GoldFactor[v] = factor
            --print(GetObjectName(v))
        end
        return shopObject
    end
    function TasItemShopLumberFactor(unitCode, factor, ...)
        local shopObject = TasItemShopCreateShop(unitCode)
        for i, v in ipairs({...}) do
            if type(v) == "string" then v = FourCC(v) end
            shopObject.LumberFactor[v] = factor
            --print(GetObjectName(v))
        end
        return shopObject
    end
    
    

    local real = MarkGameStarted
    local Shoper = {}
    local DoubleClickStamp = 0
    local ShoperMain = {}
    local CurrentShop = {}
    local LocalShopObject
    local CurrentOffSetInventory = __jarray(0)
    local CurrentOffSetMaterial = __jarray(0)
    local CurrentOffSetUpgrade = __jarray(0)
    local CurrentOffSetUser = __jarray(0)
    local CurrentOffSetQuickLink = __jarray(0)
    local xSize -- Size of the total Box
    local ySize -- this is autocalced

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
                    if #TasItemShopUI.QuickLink[player] <= refButtonCountQuickLink then
                        CurrentOffSetQuickLink[player] = 0
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

    local function CanBuyItem(itemCode, shopObject, player)
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
        return BUY_ABLE_ITEMS.Marker[player][itemCode]
    end
    local function AllMatsProvided(player, itemCode, shopObject)
        local missing = {}
        local count = 0
        for i, v in ipairs(TasItemFusionGetMissingMaterial(TasItemFusion.Player[player].UseAble, itemCode)) do
            if not CanBuyItem(v, shopObject, player) then
                count = count + 1
                missing[count] = v
            end
        end
        return missing
    end
    

    local function updateItemFrame(frameObject, data, showGold, showLumber)
        
        if frameObject.HighLight ~= nil then
            BlzFrameSetVisible(frameObject.HighLight, TasItemShopUI.MarkedItemCodes[data])
        end
        if showGold == nil then
            showGold = buttonListShowGold
            showLumber = buttonListShowLumber
        end
        BlzFrameSetTexture(frameObject.Icon, BlzGetAbilityIcon(data), 0, false)
        BlzFrameSetText(frameObject.Text, GetObjectName(data))
    
        BlzFrameSetTexture(frameObject.ToolTipFrameIcon, BlzGetAbilityIcon(data), 0, false)
        BlzFrameSetText(frameObject.ToolTipFrameName, GetObjectName(data))      
    --        frameObject.ToolTipFrameSeperator
        BlzFrameSetText(frameObject.ToolTipFrameText, BlzGetAbilityExtendedTooltip(data, 0))

        if string.len(BlzGetAbilityExtendedTooltip(data, 0)) >= toolTipLimitBig then
            BlzFrameSetSize(frameObject.ToolTipFrameText, toolTipSizeXBig, 0)
        else
            BlzFrameSetSize(frameObject.ToolTipFrameText, toolTipSizeX, 0)
        end
  

        if showGold or showLumber then
            local gold, lumber
            if TasItemFusion.BuiltWay[data] then
                gold, lumber = TasItemFusionCalc(TasItemFusion.Player[GetLocalPlayer()].UseAble, data, nil, true)
            else
                gold, lumber = TasItemGetCost(data)
            end
            gold, lumber = CostModifier(gold, lumber, data, ShoperMain[GetLocalPlayer()], CurrentShop[GetLocalPlayer()], LocalShopObject)
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
    local function updateUndoButton(data, actionName)
        BlzFrameSetTexture(TasItemShopUI.Frames.UndoButtonIcon, BlzGetAbilityIcon(data), 0, false)
        BlzFrameSetTexture(TasItemShopUI.Frames.UndoButtonIconPushed, BlzGetAbilityIcon(data), 0, false)
        BlzFrameSetText(TasItemShopUI.Frames.UndoText, GetLocalizedString(textUndo).. actionName .. "\n" .. GetObjectName(data))
    end
    
    local function GiveItem(unit, item, undo)
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
    local function GiveItemGroup(player, item, undo)
        SetItemPlayer(item, player)
        GiveItem(ShoperMain[player], item, undo)
        -- other units can get the item when the mainShopper can not hold it?
        -- Check if item still exists and mainshopper does not have it.
        if canProviderGetItem and GetHandleId(item) > 0 and not UnitHasItem(ShoperMain[player], item)  then
            -- loop all mat provider try to give it to each, when that succeds finished.
            local found = false
            for i = 0, BlzGroupGetSize(Shoper[player]) - 1, 1 do
                local unit = BlzGroupUnitAt(Shoper[player], i)
                GiveItem(unit, item, undo)
                if GetHandleId(item) == 0 or UnitHasItem(unit, item) then
                    found = true
                    if canUndo then
                       table.insert(undo.ResultItem, {item, unit})
                    end
                    break
                end
            end
            if not found and canUndo then
                table.insert(undo.ResultItem, {item})
            end
        else
            if canUndo then
                table.insert(undo.ResultItem, {item, ShoperMain[player]})
            end
        end

    end
    local function BuyItem(player, itemCode)
        
        xpcall( function()
        --print(GetPlayerName(player), "Wana Buy", GetObjectName(itemCode), "with", GetUnitName(ShoperMain[player]))
        if BlzGroupGetSize(Shoper[player]) == 0 then
            if GetLocalPlayer() == player then
                print(GetLocalizedString(textNoValidShopper))
            end
            return
        end
        local gold, lumber, items
        local shopObject = TasItemShopUI.Shops[GetUnitTypeId(CurrentShop[player])]
        -- can not buy this?
        if not flexibleShop and not CanBuyItem(itemCode, shopObject, player) then
            if GetLocalPlayer() == player then print(GetObjectName(itemCode), GetLocalizedString(textCanNotBuySufix)) end
            return
        end

        if TasItemFusion.BuiltWay[itemCode] then
            gold, lumber, items = TasItemFusionCalc(TasItemFusion.Player[player].UseAble, itemCode)
        else
            gold, lumber = TasItemGetCost(itemCode)
        end

        gold, lumber = CostModifier(gold, lumber, itemCode,  ShoperMain[player], CurrentShop[player], shopObject)

        -- only items buyable in the shop can be replaced by Gold? Also ignore non fusion items.
        if not flexibleShop and TasItemFusion.BuiltWay[itemCode] then
            local missingItemCode = AllMatsProvided(player, itemCode, shopObject)
            if #missingItemCode > 0 then
                if GetLocalPlayer() == player then print(GetLocalizedString(textCanNotBuyPrefix), GetObjectName(itemCode)) for i, v in ipairs(missingItemCode) do print(GetObjectName(v), GetLocalizedString(textCanNotBuySufix)) end end
                return
            end
        end

        if GetPlayerState(player, PLAYER_STATE_RESOURCE_GOLD) >= gold then
            if GetPlayerState(player, PLAYER_STATE_RESOURCE_LUMBER) >= lumber then
                local undo
                if canUndo then
                    local units = {}
                    undo = {ResultItem = {}, Result = itemCode, Gold = gold, Lumber = lumber, Items = {}, ActionName = "Buy"}
                    table.insert(TasItemShopUI.Undo[player], undo)
                    for i = 0, BlzGroupGetSize(Shoper[player]) - 1, 1 do
                        units[i + 1] = BlzGroupUnitAt(Shoper[player], i)
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
                        updateUndoButton(undo.Result, undo.ActionName)
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
                local newItem = CreateItem(itemCode, GetUnitX(ShoperMain[player]), GetUnitY(ShoperMain[player]))
                GiveItemGroup(player, newItem, undo)
                
                --CreateItem(itemCode, GetPlayerStartLocationX(player), GetPlayerStartLocationY(player))
                TasItemShopUIShow(player, CurrentShop[player])
            elseif not GetSoundIsPlaying(SoundNoLumber[GetPlayerRace(player)]) then
                StartSoundForPlayerBJ(player, SoundNoLumber[GetPlayerRace(player)])
            end
        elseif not GetSoundIsPlaying(SoundNoGold[GetPlayerRace(player)]) then
            StartSoundForPlayerBJ(player, SoundNoGold[GetPlayerRace(player)])
        end
    end, print)
    end

    local function SellItem(player, item)
        xpcall(function()
        local wasSelectedItem = (item == TasItemShopUI.SelectedItem[player])
        if not item then return end
        local itemCode = GetItemTypeId(item)

        local gold, lumber, charges = GetItemSellCosts(ShoperMain[player], CurrentShop[player], item)
        
        AdjustPlayerStateSimpleBJ(player, PLAYER_STATE_RESOURCE_GOLD, gold)
        AdjustPlayerStateSimpleBJ(player, PLAYER_STATE_RESOURCE_LUMBER, lumber)
        if canUndo then
            undo = {ResultItem = {}, Result = itemCode, Gold = -gold, Lumber = -lumber, Items = {}, ActionName = "Sell"}
            table.insert(TasItemShopUI.Undo[player], undo)
            for i = 0, BlzGroupGetSize(Shoper[player]) - 1, 1 do
                owner = BlzGroupUnitAt(Shoper[player], i)
                if UnitHasItem(owner, item) then
                    UnitRemoveItem(owner, item)
                    SetItemVisible(item, false)
                    undo.Items[1] = {item, owner}
                    break
                end
            end
            
            if GetLocalPlayer() == player then
                BlzFrameSetVisible(TasItemShopUI.Frames.BoxUndo, true)
                updateUndoButton(undo.Result, undo.ActionName)
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
    local function updateRefButton(frameObject, data, unit, updateBroken)
        if data and data > 0 then
            BlzFrameSetVisible(frameObject.Button, true)
            BlzFrameSetTexture(frameObject.Icon, BlzGetAbilityIcon(data), 0, false)
            BlzFrameSetTexture(frameObject.IconPushed, BlzGetAbilityIcon(data), 0, false)
            BlzFrameSetTexture(frameObject.ToolTipFrameIcon, BlzGetAbilityIcon(data), 0, false)
            if frameObject.ToolTipFrameName then
                BlzFrameSetText(frameObject.ToolTipFrameName, GetObjectName(data))
                BlzFrameSetText(frameObject.ToolTipFrameText, BlzGetAbilityExtendedTooltip(data, 0))
                if string.len(BlzGetAbilityExtendedTooltip(data, 0)) >= toolTipLimitBig then
                    BlzFrameSetSize(frameObject.ToolTipFrameText, toolTipSizeXBig, 0)
                else
                    BlzFrameSetSize(frameObject.ToolTipFrameText, toolTipSizeX, 0)
                end
            else
                BlzFrameSetText(frameObject.ToolTipFrameText, GetObjectName(data))
            end
            
            if unit ~= nill and IsUnitType(unit, UNIT_TYPE_HERO) then
                BlzFrameSetText(frameObject.ToolTipFrameText, BlzFrameGetText(frameObject.ToolTipFrameText) .. "\n" .. GetHeroProperName(unit))
            end
            if updateBroken then
                BlzFrameSetVisible(frameObject.IconBroken, not CanBuyItem(data, LocalShopObject, GetLocalPlayer()))
            end
        else
            BlzFrameSetVisible(frameObject.Button, false)
        end
    end
    local function updateRefButtons(dataTable, parent, refButtons, offSet, updateBroken)
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
                    updateRefButton(frameObject, data, nil, updateBroken)
                else
                    updateRefButton(frameObject, 0)
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
                updateRefButton(frameObject, data2, data)
            end
        end
        BlzFrameSetVisible(refButtons.Page, count > #refButtons)
        return validCounter
    end
    
    local function updateHaveMats(player, data)
        local itemCounter = __jarray(0)
        local mat
        local useable = TasItemFusion.Player[player].UseAble
        local offset = CurrentOffSetMaterial[player]
        for index, frameObject in ipairs(TasItemShopUI.Frames.Material) do
            if BlzFrameIsVisible(frameObject.Button) then
                mat = TasItemFusion.BuiltWay[data].Mats[index + offset]
                itemCounter[mat] = itemCounter[mat] + 1
                BlzFrameSetVisible(frameObject.IconDone, itemCounter[mat] <= useable.ByType[mat])
                BlzFrameSetVisible(frameObject.IconBroken, not BlzFrameIsVisible(frameObject.IconDone) and not CanBuyItem(mat, LocalShopObject, player))
            end
        end
    end
    local function updateOverLayMainSelected(player)
        local offset = CurrentOffSetUser[player]
        for index, frameObject in ipairs(TasItemShopUI.Frames.User) do
            BlzFrameSetVisible(frameObject.IconDone, BlzFrameIsVisible(frameObject.Button) and ShoperMain[player] == BlzGroupUnitAt(Shoper[player], index - 1 + offset))
        end
    end
    
    local function setSelected(player, data)
        local oldData = TasItemShopUI.Selected[player]
        TasItemShopUI.Selected[player] = data
        -- Reset RefPage only when a new data is selected
        if oldData ~= data then
            CurrentOffSetUpgrade[player] = 0
            CurrentOffSetMaterial[player] = 0
            TasItemShopUI.SelectedItem[player] = nil
            if player == GetLocalPlayer() then
                if canDefuse then BlzFrameSetEnable(TasItemShopUI.Frames.DefuseButton, false) end
                if canSellItems then BlzFrameSetEnable(TasItemShopUI.Frames.SellButton, false) end
            end
        end
        if player == GetLocalPlayer() then
            TasItemShopUI.MarkedItemCodes[oldData] = false
            TasItemShopUI.MarkedItemCodes[data] = true
            if refButtonCountUp > 0 then
                if TasItemFusion.UsedIn[data] then
                    updateRefButtons(TasItemFusion.UsedIn[data], TasItemShopUI.Frames.BoxUpgrades, TasItemShopUI.Frames.Upgrades, CurrentOffSetUpgrade[player], true)
                else
                    BlzFrameSetVisible(TasItemShopUI.Frames.BoxUpgrades, false)
                end
            end
            if refButtonCountMats > 0 then
                if TasItemFusion.BuiltWay[data] then
                    updateRefButtons(TasItemFusion.BuiltWay[data].Mats, TasItemShopUI.Frames.BoxMaterial, TasItemShopUI.Frames.Material, CurrentOffSetMaterial[player])                
                    updateHaveMats(player, data)
                else
                    BlzFrameSetVisible(TasItemShopUI.Frames.BoxMaterial, false)
                end
            end
            if refButtonCountInv > 0 then
                if not inventoryShowMainOnly then
                    if TasItemFusion.Player[player].UseAble.Count > 0 then
                        updateRefButtons(TasItemFusion.Player[player].UseAble, TasItemShopUI.Frames.BoxInventory, TasItemShopUI.Frames.Inventory, CurrentOffSetInventory[player])        
                    else
                        BlzFrameSetVisible(TasItemShopUI.Frames.BoxInventory, false)
                    end
                else
                    TasItemShopUI.TempTable.Count = bj_MAX_INVENTORY
                    for i = 0, bj_MAX_INVENTORY - 1 do
                        TasItemShopUI.TempTable[i + 1] = UnitItemInSlot(ShoperMain[player], i)
                    end
                    updateRefButtons(TasItemShopUI.TempTable, TasItemShopUI.Frames.BoxInventory, TasItemShopUI.Frames.Inventory, CurrentOffSetInventory[player])
                    BlzFrameSetVisible(TasItemShopUI.Frames.BoxInventory, true)
                end
            end
            if refButtonCountQuickLink > 0 then
                updateRefButtons(TasItemShopUI.QuickLink[player], TasItemShopUI.Frames.BoxQuickLink, TasItemShopUI.Frames.QuickLink, CurrentOffSetQuickLink[player], true)
            end
            if refButtonCountUser > 0 then
                updateRefButtons(Shoper[player], TasItemShopUI.Frames.BoxUser, TasItemShopUI.Frames.User, CurrentOffSetUser[player])
                updateOverLayMainSelected(player)
            end

            
            updateItemFrame(TasItemShopUI.Frames.Current, data, buyButtonShowGold, buyButtonShowLumber)
            if not flexibleShop and (not CanBuyItem(data, LocalShopObject, GetLocalPlayer()) or (TasItemFusion.BuiltWay[data] and #AllMatsProvided(player, data, LocalShopObject) > 0)) then
                BlzFrameSetText(TasItemShopUI.Frames.Current.TextGold, GetLocalizedString(textUnBuyable))
                BlzFrameSetText(TasItemShopUI.Frames.Current.TextLumber, GetLocalizedString(textUnBuyable))
            end
        end
    end
    
    local function setSelectedItem(player, item)
        TasItemShopUI.SelectedItem[player] = item
        if item ~= nil then
            local itemCode = GetItemTypeId(item)
            local gold, lumber, charges
            if GetLocalPlayer() == player then
                if canDefuse then
                    BlzFrameSetText(TasItemShopUI.Frames.DefuseText, GetLocalizedString(textDefuse).."\n"..BlzGetAbilityTooltip(itemCode, 0))
                    BlzFrameSetEnable(TasItemShopUI.Frames.DefuseButton, TasItemFusion.BuiltWay[itemCode] ~=nil)
                end

                if canSellItems then
                    BlzFrameSetEnable(TasItemShopUI.Frames.SellButton, true)
                    --BlzFrameSetVisible(TasItemShopUI.Frames.BoxSell, true)
                    gold, lumber, charges = GetItemSellCosts(ShoperMain[player], CurrentShop[player], item)
                    BlzFrameSetText(TasItemShopUI.Frames.SellText, GetLocalizedString(textSell) .. " " .. GetItemName(item) .. "\n" .. GetLocalizedString("GOLD") .. " " .. gold .. "\n"..GetLocalizedString("LUMBER") .." " .. lumber)
                end
            end
        end
    end
function TasItemShopUI.Create()
    BlzLoadTOCFile("war3mapImported\\Templates.toc")
    BlzLoadTOCFile("war3mapImported\\TasItemShop.toc")

    local frames, parent, object, currentObject, frame
    parent = GetParent()

    if posScreenRelative then
        frame = BlzCreateFrameByType("FRAME", "Fullscreen", parent, "", 0)
        BlzFrameSetVisible(frame, false)
        BlzFrameSetSize(frame, 0.8, 0.6)
        BlzFrameSetAbsPoint(frame, FRAMEPOINT_BOTTOM, 0.4, 0)
        TasItemShopUI.Frames.Fullscreen = frame
    end

    xSize = 0.02 + buttonListCols*buttonListButtonSizeX + buttonListButtonGapCol * (buttonListCols - 1)
    --ySize = 0.1285 + buttonListRows*buttonListButtonSizeY + refButtonBoxSizeY
    ySize = 0.0815 + buttonListRows*buttonListButtonSizeY + buttonListButtonGapRow * (buttonListRows - 1)
    
    -- super
    TasItemShopUI.Frames.ParentSuper = BlzCreateFrameByType("FRAME", "TasItemShopUI", parent, "", 0)
    BlzFrameSetSize(TasItemShopUI.Frames.ParentSuper, 0.001, 0.001)
    
    parent = BlzCreateFrameByType("BUTTON", "TasItemShopUI", TasItemShopUI.Frames.ParentSuper, "", 0)
    BlzFrameSetSize(parent, xSize, ySize)
    BlzTriggerRegisterFrameEvent(TasItemShopUI.TriggerScrollParent, parent, FRAMEEVENT_MOUSE_WHEEL)
    BlzTriggerRegisterFrameEvent(TasItemShopUI.TriggerClearFocus, parent, FRAMEEVENT_CONTROL_CLICK)
    if posScreenRelative then
        BlzFrameSetPoint(parent, posPoint, TasItemShopUI.Frames.Fullscreen, posPoint, xPos, yPos)
    else
        BlzFrameSetAbsPoint(parent, posPoint, xPos, yPos)
    end
    
    TasItemShopUI.Frames.ParentSuperUI = parent


    frame = BlzCreateFrame(boxFrameName, parent, 0, 0)
    BlzFrameSetAllPoints(frame, parent)
    TasItemShopUI.Frames.BoxSuper = frame

    -- round down, boxSize - 2times gap to border / buttonSize + gap between buttons
    local buttonsInRow = math.floor(0.0 + ((xSize - (boxCatBorderGap)*2)/(categoryButtonSize + 0.003)))
    -- round up
    local rows = math.ceil(0.0+ (#TasItemShopUI.Categories/buttonsInRow))
    --print(#TasItemShopUI.Categories, buttonsInRow, rows)
    ySize = ySize + rows * categoryButtonSize
    -- ButtonList
    parent = BlzCreateFrame(boxButtonListFrameName, TasItemShopUI.Frames.BoxSuper, 0, 0)
    BlzFrameSetPoint(parent, FRAMEPOINT_TOPRIGHT, TasItemShopUI.Frames.BoxSuper, FRAMEPOINT_TOPRIGHT, 0, 0)  
    -- baseSizeY = 0.0455
    BlzFrameSetSize(parent, xSize, 0.0455 + buttonListRows*buttonListButtonSizeY + rows * categoryButtonSize + buttonListButtonGapRow * (buttonListRows - 1))
    --ySize = 0.1285 + buttonListRows*buttonListButtonSizeY + refButtonBoxSizeY
    object = CreateTasButtonListEx(buttonListButtonName, buttonListCols, buttonListRows, parent,
        function(clickedData, buttonListObject, dataIndex)
            local player = GetTriggerPlayer()
            
            if player == GetLocalPlayer() then
                local time = os.clock()
                if TasItemShopUI.Selected[player] == clickedData and time - DoubleClickStamp <= doubleClickTimeOut then
                    -- finish the timer, so the player has to do 2 clicks again to trigger a DoubleClick
                    DoubleClickStamp = 0
                    BlzFrameClick(TasItemShopUI.Frames.Current.Button)
                else
                    DoubleClickStamp = time
                end
            end
            if TasItemShopUI.QuickLinkKeyActive[player] then
                TasItemShopUI.SetQuickLink(player, clickedData)
            end

            setSelected(player, clickedData)
            
        end
        ,function(clickedData, buttonListObject, dataIndex) BuyItem(GetTriggerPlayer(), clickedData) end
        ,updateItemFrame
        ,function(data, searchedText, buttonListObject)
            --return string.find(GetObjectName(data), searchedText)
            return string.find(string.lower(GetObjectName(data)), string.lower(searchedText))
            --return string.find(string.lower(BlzGetAbilityExtendedTooltip(data, 0)), string.lower(searchedText))
        end
        ,function(data, buttonListObject, isTextSearching)
            local selected = TasItemShopUI.Categories.Value[GetLocalPlayer()]
            if ToggleIconButtonGetValue(TasItemShopUI.ModeObject, GetLocalPlayer()) == 0 then
                return selected == 0 or BlzBitAnd(TasItemCategory[data], selected) >= selected
            else
                return selected == 0 or BlzBitAnd(TasItemCategory[data], selected) > 0
            end
        end
        --async Left Click
        ,function(buttonListObject, data, frame)
        end
        --async Rigth Click
        ,function(buttonListObject, data, frame)
            ShowSprite(frame, GetLocalPlayer())
        end
        ,buttonListButtonGapCol
        ,buttonListButtonGapRow
    )
    TasItemShopUI.ButtonList = object
    TasItemShopUI.Frames.BoxButtonList = parent
    
    for i, frameObject in ipairs(object.Frames) do
        if buttonListHighLightFrameName then
            frameObject.HighLight = BlzCreateFrame(buttonListHighLightFrameName, frameObject.Button, 0, 0)
            BlzFrameSetAllPoints(frameObject.HighLight, frameObject.Button)
            BlzFrameSetVisible(frameObject.HighLight, false)
        end

    end
    
    
    -- category
    frame = BlzCreateFrame(boxCatFrameName, parent, 0, 0)
    BlzFrameSetPoint(frame, FRAMEPOINT_TOPRIGHT, TasItemShopUI.ButtonList.InputFrame, FRAMEPOINT_BOTTOMRIGHT, 0, 0)
    BlzFrameSetSize(frame, xSize, 0.0135 + rows * categoryButtonSize)
    TasItemShopUI.Frames.BoxCategory = frame
    parent = frame
    frames = {}
    local groupObject = CreateToggleIconButtonGroup(true, function(groupObject, buttonObject, player, groupValue)
        TasItemShopUI.Categories.Value[player] = groupValue
        TasButtonListSearch(TasItemShopUI.ButtonList)
    end)
    ToggleIconButton.DefaultSizeX = categoryButtonSize
    ToggleIconButton.DefaultSizeY = categoryButtonSize
    --frame = ToggleIconButtonGroupModeButton(groupObject, parent).Button
    local clearButton = ToggleIconButtonGroupClearButton(groupObject, parent)
    --BlzFrameSetPoint(frame, FRAMEPOINT_TOPLEFT, TasItemShopUI.Frames.BoxSuper, FRAMEPOINT_TOPLEFT, boxFrameBorderGap, -boxFrameBorderGap)
    BlzFrameSetPoint(clearButton, FRAMEPOINT_TOPLEFT, TasItemShopUI.Frames.BoxSuper, FRAMEPOINT_TOPLEFT, boxFrameBorderGap, -boxFrameBorderGap)
    BlzTriggerRegisterFrameEvent(TasItemShopUI.TriggerClearButton, clearButton, FRAMEEVENT_CONTROL_CLICK)
    BlzTriggerRegisterFrameEvent(TasItemShopUI.TriggerClearFocus, clearButton, FRAMEEVENT_CONTROL_CLICK)

    local modeObject = CreateToggleIconButton(parent, 1, GetLocalizedString(categoryModeTextOr), categoryModeIconOr, 0, GetLocalizedString(categoryModeTextAnd), categoryModeIconAnd)
    BlzFrameSetPoint(modeObject.Button, FRAMEPOINT_BOTTOMLEFT, clearButton, FRAMEPOINT_BOTTOMRIGHT, 0.003, 0)
    modeObject.Action = function()
        if GetTriggerPlayer() == GetLocalPlayer() then
            TasButtonListSearch(TasItemShopUI.ButtonList)
        end
    end
    TasItemShopUI.ModeObject = modeObject
    

    for index, value in ipairs(TasItemShopUI.Categories) do
        frames[index] = CreateToggleIconButton(parent, CategoryValue[index], GetLocalizedString(value[2]), value[1])
        if index == 1 then      
            BlzFrameSetPoint(frames[index].Button, FRAMEPOINT_TOPLEFT, parent, FRAMEPOINT_TOPLEFT, boxCatBorderGap, -boxCatBorderGap)
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


    if toolTipPosY and toolTipPosX then
        for i, v in ipairs(TasItemShopUI.ButtonList.Frames) do
            BlzFrameClearAllPoints(v.ToolTipFrameText)
            if toolTipPosPointParent then
                BlzFrameSetPoint(v.ToolTipFrameText, toolTipPosPoint, v.Button, toolTipPosPointParent, toolTipPosX, toolTipPosY)                
            else
                BlzFrameSetAbsPoint(v.ToolTipFrameText, toolTipPosPoint, toolTipPosX, toolTipPosY)
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
            BlzFrameSetSize(frame, refButtonSize, refButtonSize)
            
            BlzFrameSetVisible(frames[index].IconDone, false)
            BlzFrameSetVisible(frames[index].IconBroken, false)
            if haveTooltip then
                CreateTasButtonTooltip(frames[index], TasItemShopUI.Frames.BoxSuper)
                
                if toolTipPosY and toolTipPosX then
                    BlzFrameClearAllPoints(frames[index].ToolTipFrameText)
                    if toolTipPosPointParent then
                        BlzFrameSetPoint(frames[index].ToolTipFrameText, toolTipPosPoint, frames[index].Button, toolTipPosPointParent, toolTipPosX, toolTipPosY)
                    else
                        BlzFrameSetAbsPoint(frames[index].ToolTipFrameText, toolTipPosPoint, toolTipPosX, toolTipPosY)
                    end
                end
            end
            if index == 1 then
                BlzFrameSetPoint(frame, FRAMEPOINT_TOPLEFT, textFrame, FRAMEPOINT_BOTTOMLEFT, 0.0, -0.003)
            --elseif index == 5 then
            -- BlzFrameSetPoint(frame, FRAMEPOINT_BOTTOMLEFT, frames[index - 4].Button, FRAMEPOINT_TOPLEFT, 0, 0.003)
            else
                BlzFrameSetPoint(frame, FRAMEPOINT_BOTTOMLEFT, frames[index - 1].Button, FRAMEPOINT_BOTTOMRIGHT, refButtonGap, 0)
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
        BlzFrameSetPoint(frames.PageDown, FRAMEPOINT_TOPRIGHT, textFrame, FRAMEPOINT_BOTTOMRIGHT, 0.0, -refButtonGap)
        for i, v in ipairs(frames) do
            
            BlzFrameClearAllPoints(v.Button)
            if i == 1 then
                BlzFrameSetPoint(v.Button, FRAMEPOINT_TOP, box, FRAMEPOINT_TOP, 0.0, -BlzFrameGetHeight(textFrame) - refButtonPageSize -refButtonGap*2 -boxFrameBorderGap)
            else
                BlzFrameSetPoint(v.Button, FRAMEPOINT_TOPLEFT, frames[i - 1].Button, FRAMEPOINT_BOTTOMLEFT, 0, -refButtonGap)
            end
        end
        BlzFrameSetSize(box, BlzFrameGetWidth(textFrame) + boxFrameBorderGap*2 , (refButtonSize + refButtonGap)*#frames + refButtonPageSize + boxFrameBorderGap*2)
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
        BlzFrameSetSize(frames[2], refButtonPageSize, refButtonPageSize)
        BlzFrameSetSize(frames[5], refButtonPageSize, refButtonPageSize)
        BlzTriggerRegisterFrameEvent(trigger, frames[2], FRAMEEVENT_CONTROL_CLICK)
        BlzTriggerRegisterFrameEvent(trigger, frames[2], FRAMEEVENT_MOUSE_UP)
        BlzTriggerRegisterFrameEvent(TasItemShopUI.TriggerClearFocus, frames[2], FRAMEEVENT_CONTROL_CLICK)
        BlzTriggerRegisterFrameEvent(trigger, frames[5], FRAMEEVENT_CONTROL_CLICK)
        BlzTriggerRegisterFrameEvent(trigger, frames[5], FRAMEEVENT_MOUSE_UP)
        BlzTriggerRegisterFrameEvent(TasItemShopUI.TriggerClearFocus, frames[5], FRAMEEVENT_CONTROL_CLICK)
        BlzFrameSetTexture(frames[3], refButtonPageUp, 0, false)
        BlzFrameSetTexture(frames[4], refButtonPageUp, 0, false)
        BlzFrameSetTexture(frames[6], refButtonPageDown, 0, false)
        BlzFrameSetTexture(frames[7], refButtonPageDown, 0, false)

        --BlzFrameSetPoint(frames[2], FRAMEPOINT_TOPLEFT, textFrame, FRAMEPOINT_TOPRIGHT, 0.003, 0)
        --BlzFrameSetPoint(frames[8], FRAMEPOINT_TOPLEFT, frames[2], FRAMEPOINT_TOPRIGHT, 0.003, 0)
        --BlzFrameSetPoint(frames[5], FRAMEPOINT_TOPLEFT, frames[8], FRAMEPOINT_TOPRIGHT, 0.003, 0)

        BlzFrameSetPoint(frames[2], FRAMEPOINT_TOPRIGHT, frames[8], FRAMEPOINT_TOPLEFT, -0.003, 0)
        BlzFrameSetPoint(frames[8], FRAMEPOINT_TOPRIGHT, frames[5], FRAMEPOINT_TOPLEFT, -0.003, 0)
        BlzFrameSetPoint(frames[5], FRAMEPOINT_TOPRIGHT, parent, FRAMEPOINT_TOPRIGHT, -boxFrameBorderGap, -boxFrameBorderGap)

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
            refRows[1] = {xSize - BlzFrameGetWidth(box), box}
            ySize = ySize + refButtonBoxSizeY
            BlzFrameSetSize(TasItemShopUI.Frames.ParentSuperUI, xSize, ySize)
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
                table.insert(refRows, {xSize - BlzFrameGetWidth(box), box})
                ySize = ySize + refButtonBoxSizeY
                BlzFrameSetSize(TasItemShopUI.Frames.ParentSuperUI, xSize, ySize)
                return #refRows
            end
        end
        
    end

    local function PlaceRefButtonBoxCol(box)
        
        if #refRows == 0 then
            BlzFrameSetPoint(box, FRAMEPOINT_TOPRIGHT, TasItemShopUI.Frames.ParentSuperUI, FRAMEPOINT_TOPLEFT, 0, 0)
            refRows[1] = {ySize - BlzFrameGetHeight(box), box}
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
                table.insert(refRows, {ySize - BlzFrameGetHeight(box), box})
                return #refRows
            end
        end
    end
   
    
    -- built from
    if refButtonCountMats > 0 then
        parent = BlzCreateFrame(boxRefFrameName, TasItemShopUI.Frames.BoxSuper, 0, 0)
        BlzFrameSetSize(parent, (refButtonSize + refButtonGap)*refButtonCountMats + boxFrameBorderGap*2, refButtonBoxSizeY)
        local row = PlaceRefButtonBox(parent)
        TasItemShopUI.Frames.BoxMaterial = parent

        frame = BlzCreateFrame("TasButtonTextTemplate", parent, 0, 0)
        BlzFrameSetPoint(frame, FRAMEPOINT_TOPLEFT, parent, FRAMEPOINT_TOPLEFT, boxRefBorderGap, -boxRefBorderGap)
        BlzFrameSetText(frame, GetLocalizedString(textMats))
        TasItemShopUI.Frames.MaterialText = frame

        TasItemShopUI.Frames.Material = CreateRefButtons(refButtonCountMats, parent, frame, TasItemShopUI.TriggerMaterial, true)

        CreateRefPage(parent, TasItemShopUI.Frames.MaterialText, TasItemShopUI.TriggerMaterialPage, refButtonCountMats, TasItemShopUI.Frames.Material)
    end

    -- possible upgrades
    if refButtonCountUp > 0 then
        parent = BlzCreateFrame(boxRefFrameName, TasItemShopUI.Frames.BoxSuper, 0, 0)
        BlzFrameSetSize(parent, (refButtonSize + refButtonGap)*refButtonCountUp + boxFrameBorderGap*2, refButtonBoxSizeY)
        local row = PlaceRefButtonBox(parent)
        TasItemShopUI.Frames.BoxUpgrades = parent

        frame = BlzCreateFrame("TasButtonTextTemplate", parent, 0, 0)
        BlzFrameSetPoint(frame, FRAMEPOINT_TOPLEFT, parent, FRAMEPOINT_TOPLEFT, boxRefBorderGap, -boxRefBorderGap)
        BlzFrameSetText(frame, GetLocalizedString(textUpgrades))
        TasItemShopUI.Frames.UpgradesText = frame

        TasItemShopUI.Frames.Upgrades = CreateRefButtons(refButtonCountUp, parent, frame, TasItemShopUI.TriggerUpgrade, true)

        CreateRefPage(parent, TasItemShopUI.Frames.UpgradesText, TasItemShopUI.TriggerUpgradePage, refButtonCountUp, TasItemShopUI.Frames.Upgrades)
    end  
    
    -- ShortCuts
    if refButtonCountQuickLink > 0 then
        parent = BlzCreateFrame(boxRefFrameName, TasItemShopUI.Frames.BoxSuper, 0, 0)
        BlzFrameSetSize(parent, (refButtonSize + refButtonGap)*refButtonCountQuickLink + boxFrameBorderGap*2, refButtonBoxSizeY)
        local row = PlaceRefButtonBox(parent)
        TasItemShopUI.Frames.BoxQuickLink = parent

        frame = BlzCreateFrame("TasButtonTextTemplate", parent, 0, 0)
        BlzFrameSetPoint(frame, FRAMEPOINT_TOPLEFT, parent, FRAMEPOINT_TOPLEFT, boxRefBorderGap, -boxRefBorderGap)
        BlzFrameSetText(frame, GetLocalizedString(textQuickLink))
        TasItemShopUI.Frames.QuickLinkText = frame

        TasItemShopUI.Frames.QuickLinkHighLight = BlzCreateFrame(buttonListHighLightFrameName, parent, 0, 0)
        BlzFrameSetAllPoints(TasItemShopUI.Frames.QuickLinkHighLight, parent)
        BlzFrameSetVisible(TasItemShopUI.Frames.QuickLinkHighLight, false)

        TasItemShopUI.Frames.QuickLink = CreateRefButtons(refButtonCountQuickLink, parent, frame, TasItemShopUI.TriggerQuickLink, true)

        CreateRefPage(parent, TasItemShopUI.Frames.QuickLinkText, TasItemShopUI.TriggerQuickLinkPage, refButtonCountQuickLink, TasItemShopUI.Frames.QuickLink)
    end

    -- Inventory
    if refButtonCountInv > 0 then
        parent = BlzCreateFrame(boxRefFrameName, TasItemShopUI.Frames.BoxSuper, 0, 0)
        BlzFrameSetSize(parent, (refButtonSize + refButtonGap)*refButtonCountInv + boxFrameBorderGap*2, refButtonBoxSizeY)
        local row = PlaceRefButtonBox(parent)
        
        TasItemShopUI.Frames.BoxInventory = parent

        frame = BlzCreateFrame("TasButtonTextTemplate", parent, 0, 0)
        BlzFrameSetPoint(frame, FRAMEPOINT_TOPLEFT, parent, FRAMEPOINT_TOPLEFT, boxRefBorderGap, -boxRefBorderGap)
        BlzFrameSetText(frame, GetLocalizedString(textInventory))
        TasItemShopUI.Frames.InventoryText = frame

        TasItemShopUI.Frames.Inventory = CreateRefButtons(refButtonCountInv, parent, frame, TasItemShopUI.TriggerInventory, true)

        for i, v in ipairs(TasItemShopUI.Frames.Inventory) do
            BlzFrameSetTexture(v.IconDone, MainItemTexture, 0, true)
        end

        CreateRefPage(parent, TasItemShopUI.Frames.InventoryText, TasItemShopUI.TriggerInventoryPage, refButtonCountInv, TasItemShopUI.Frames.Inventory)
    end

    -- User
    if refButtonCountUser > 0 then
        parent = BlzCreateFrame(boxRefFrameName, TasItemShopUI.Frames.BoxSuper, 0, 0)
        BlzFrameSetSize(parent, (refButtonSize + refButtonGap)*refButtonCountUser + boxFrameBorderGap*2, refButtonBoxSizeY)

        PlaceRefButtonBox(parent)
        if refBoxUserPos then
            PlaceRefButtonBoxFree(parent, refBoxUserPos, refBoxUserRelative, refBoxUserPosRelative, refBoxUserX, refBoxUserY, refBoxUserDirection)
        else
            
        end
        TasItemShopUI.Frames.BoxUser = parent

        frame = BlzCreateFrame("TasButtonTextTemplate", parent, 0, 0)
        BlzFrameSetPoint(frame, FRAMEPOINT_TOPLEFT, parent, FRAMEPOINT_TOPLEFT, boxRefBorderGap, -boxRefBorderGap)
        BlzFrameSetText(frame, GetLocalizedString(textUser))
        TasItemShopUI.Frames.UserText = frame
        TasItemShopUI.Frames.User = CreateRefButtons(refButtonCountUser, parent, frame, TasItemShopUI.TriggerUser, false)

        
        for i, v in ipairs(TasItemShopUI.Frames.User) do
            BlzFrameSetTexture(v.IconDone, MainUserTexture, 0, true)
            v.ToolTipFrameText = CreateSimpleTooltip(v.Button, "User")
        end

        CreateRefPage(parent, TasItemShopUI.Frames.UserText, TasItemShopUI.TriggerUserPage, refButtonCountUser, TasItemShopUI.Frames.User)
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
    BlzFrameSetPoint(frameObject.Button, FRAMEPOINT_BOTTOM, TasItemShopUI.Frames.BoxSuper, FRAMEPOINT_BOTTOM, 0, boxFrameBorderGap)
    TasItemShopUI.Frames.Current = frameObject
    currentObject = frameObject
    BlzTriggerRegisterFrameEvent(TasItemShopUI.TriggerBuy, currentObject.Button, FRAMEEVENT_CONTROL_CLICK)
    BlzTriggerRegisterFrameEvent(TasItemShopUI.TriggerClearFocus, currentObject.Button, FRAMEEVENT_CONTROL_CLICK)

    
    frame = BlzCreateFrame("TasButtonTextTemplate", TasItemShopUI.Frames.BoxSuper, 0, 0)
    BlzFrameSetPoint(frame, FRAMEPOINT_BOTTOMRIGHT, TasItemShopUI.ButtonList.InputFrame, FRAMEPOINT_BOTTOMLEFT, -boxFrameBorderGap, 0)
    BlzFrameSetPoint(frame, FRAMEPOINT_TOPLEFT, modeObject.Button, FRAMEPOINT_TOPRIGHT, boxFrameBorderGap, 0)
    BlzFrameSetTextAlignment(frame, TEXT_JUSTIFY_CENTER, TEXT_JUSTIFY_MIDDLE)
    BlzFrameSetText(frame, "Name")
    TasItemShopUI.Frames.TitelText = frame

    BlzFrameClearAllPoints(currentObject.ToolTipFrameText)
    if toolTipPosPointParent then
        BlzFrameSetPoint(currentObject.ToolTipFrameText, toolTipPosPoint, currentObject.Button, toolTipPosPointParent, toolTipPosX, toolTipPosY)
    else
        BlzFrameSetAbsPoint(currentObject.ToolTipFrameText, toolTipPosPoint, toolTipPosX, toolTipPosY)
    end

    if canUndo then
        parent = BlzCreateFrame(boxUndoFrameName, TasItemShopUI.Frames.BoxSuper, 0, 0)
        BlzFrameSetSize(parent, refButtonSize + boxUndoBorderGap*2, refButtonSize + boxUndoBorderGap*2)
        BlzFrameSetPoint(parent, FRAMEPOINT_BOTTOMLEFT, TasItemShopUI.Frames.BoxSuper, FRAMEPOINT_BOTTOMLEFT, 0.00, 0.00)
        TasItemShopUI.Frames.BoxUndo = parent
        TasItemShopUI.Frames.UndoButton = BlzCreateFrame("TasItemShopCatButton", parent, 0, 0)
        TasItemShopUI.Frames.UndoButtonIcon = BlzGetFrameByName("TasItemShopCatButtonBackdrop", 0)
        TasItemShopUI.Frames.UndoButtonIconPushed = BlzGetFrameByName("TasItemShopCatButtonBackdropPushed", 0)
        TasItemShopUI.Frames.UndoText = CreateSimpleTooltip(TasItemShopUI.Frames.UndoButton, textUndo)

        frame = TasItemShopUI.Frames.UndoButton
        BlzFrameSetSize(frame, refButtonSize, refButtonSize)
        BlzFrameSetPoint(frame, FRAMEPOINT_CENTER, parent, FRAMEPOINT_CENTER, 0, 0)
        BlzTriggerRegisterFrameEvent(TasItemShopUI.TriggerUndo, frame, FRAMEEVENT_CONTROL_CLICK)
        BlzTriggerRegisterFrameEvent(TasItemShopUI.TriggerClearFocus, frame, FRAMEEVENT_CONTROL_CLICK)
        BlzFrameSetVisible(TasItemShopUI.Frames.BoxUndo, false)
    end

    if canDefuse then
        parent = BlzCreateFrame(boxDefuseFrameName, TasItemShopUI.Frames.BoxSuper, 0, 0)
        BlzFrameSetSize(parent, refButtonSize + boxDefuseBorderGap*2, refButtonSize + boxDefuseBorderGap*2)
        BlzFrameSetPoint(parent, FRAMEPOINT_BOTTOMRIGHT, TasItemShopUI.Frames.BoxSuper, FRAMEPOINT_BOTTOMRIGHT, 0.00, 0.00)
        TasItemShopUI.Frames.BoxDefuse = parent
        TasItemShopUI.Frames.DefuseButton = BlzCreateFrame("TasItemShopCatButton", parent, 0, 0)
        TasItemShopUI.Frames.DefuseButtonIcon = BlzGetFrameByName("TasItemShopCatButtonBackdrop", 0)
        TasItemShopUI.Frames.DefuseButtonIconPushed = BlzGetFrameByName("TasItemShopCatButtonBackdropPushed", 0)
        TasItemShopUI.Frames.DefuseButtonIconDisabled = BlzGetFrameByName("TasItemShopCatButtonBackdropDisabled", 0)
        TasItemShopUI.Frames.DefuseText = CreateSimpleTooltip(TasItemShopUI.Frames.DefuseButton, textDefuse)
         
        BlzFrameSetTexture(TasItemShopUI.Frames.DefuseButtonIcon, DefuseButtonIcon, 0, false)
        BlzFrameSetTexture(TasItemShopUI.Frames.DefuseButtonIconPushed, DefuseButtonIcon, 0, false)
        BlzFrameSetTexture(TasItemShopUI.Frames.DefuseButtonIconDisabled, DefuseButtonIconDisabled, 0, false)
        frame = TasItemShopUI.Frames.DefuseButton
        BlzFrameSetSize(frame, refButtonSize, refButtonSize)
        BlzFrameSetPoint(frame, FRAMEPOINT_CENTER, parent, FRAMEPOINT_CENTER, 0, 0)
        BlzTriggerRegisterFrameEvent(TasItemShopUI.TriggerDefuse, frame, FRAMEEVENT_CONTROL_CLICK)
        BlzTriggerRegisterFrameEvent(TasItemShopUI.TriggerClearFocus, frame, FRAMEEVENT_CONTROL_CLICK)
        --BlzFrameSetVisible(TasItemShopUI.Frames.BoxDefuse, false)
        BlzFrameSetEnable(TasItemShopUI.Frames.DefuseButton, false)

        BlzFrameClearAllPoints(TasItemShopUI.Frames.DefuseText)
        BlzFrameSetPoint(TasItemShopUI.Frames.DefuseText, FRAMEPOINT_BOTTOMRIGHT, TasItemShopUI.Frames.DefuseButton, FRAMEPOINT_TOPRIGHT, 0, 0.008)
    end
    if canSellItems then
        parent = BlzCreateFrame(boxDefuseFrameName, TasItemShopUI.Frames.BoxSuper, 0, 0)
        BlzFrameSetSize(parent, refButtonSize + boxSellBorderGap*2, refButtonSize + boxSellBorderGap*2)
        if canDefuse then      
            BlzFrameSetPoint(parent, FRAMEPOINT_BOTTOMRIGHT, TasItemShopUI.Frames.BoxDefuse, FRAMEPOINT_BOTTOMLEFT, 0.00, 0.00)
        else
            BlzFrameSetPoint(parent, FRAMEPOINT_BOTTOMRIGHT, TasItemShopUI.Frames.BoxSuper, FRAMEPOINT_BOTTOMRIGHT, 0.00, 0.00)
        end

        TasItemShopUI.Frames.BoxSell = parent
        TasItemShopUI.Frames.SellButton = BlzCreateFrame("TasItemShopCatButton", parent, 0, 0)
        TasItemShopUI.Frames.SellButtonIcon = BlzGetFrameByName("TasItemShopCatButtonBackdrop", 0)
        TasItemShopUI.Frames.SellButtonIconDisabled = BlzGetFrameByName("TasItemShopCatButtonBackdropDisabled", 0)
        TasItemShopUI.Frames.SellButtonIconPushed = BlzGetFrameByName("TasItemShopCatButtonBackdropPushed", 0)
        TasItemShopUI.Frames.SellText = CreateSimpleTooltip(TasItemShopUI.Frames.SellButton, textSell)

        BlzFrameSetTexture(TasItemShopUI.Frames.SellButtonIcon, SellButtonIcon, 0, false)
        BlzFrameSetTexture(TasItemShopUI.Frames.SellButtonIconPushed, SellButtonIcon, 0, false)
        BlzFrameSetTexture(TasItemShopUI.Frames.SellButtonIconDisabled, SellButtonIconDisabled, 0, false)
        frame = TasItemShopUI.Frames.SellButton
        BlzFrameSetSize(frame, refButtonSize, refButtonSize)
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
    BlzFrameSetSize(frame, refButtonSize, refButtonSize)
    BlzFrameSetScale(frame, spriteScale)
    BlzFrameSetModel(frame, spriteModel, 0)   
    BlzFrameSetVisible(parent, false)
    TasItemShopUI.Frames.SpriteParent = parent
    TasItemShopUI.Frames.Sprite = frame  
    if LayoutType == 1 then

    elseif LayoutType == 2 then
        ySize = ySize - refButtonBoxSizeY*#refRows
        BlzFrameSetSize(TasItemShopUI.Frames.ParentSuperUI, xSize, ySize)
        BlzFrameSetPoint(refRows[1][2], FRAMEPOINT_TOPRIGHT, TasItemShopUI.Frames.ParentSuperUI, FRAMEPOINT_BOTTOMRIGHT, 0, 0)
    elseif LayoutType == 3 then
        ySize = ySize - refButtonBoxSizeY*#refRows
        BlzFrameSetSize(TasItemShopUI.Frames.ParentSuperUI, xSize, ySize)
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
    BlzFrameSetSize(TasItemShopUI.Frames.ParentSuperUI, xSize, ySize)
    BlzFrameSetVisible(TasItemShopUI.Frames.ParentSuper, false)
end

function TasItemShopUIShow(player, shop, shopperGroup, mainShoper)
    xpcall(function()
    local flag = (shop ~=nil)
    
    if player == GetLocalPlayer() then
        BlzFrameSetVisible(TasItemShopUI.Frames.ParentSuper, flag)
        if flag then
            BlzFrameSetVisible(BlzFrameGetParent(TasItemShopUI.Frames.ParentSuper), true)
        end
    end

    if flag then
        local oldShop = CurrentShop[player]
        local isNewShopType = GetUnitTypeId(oldShop) ~= GetUnitTypeId(shop)
        CurrentShop[player] = shop

        if mainShoper then
            ShoperMain[player] = mainShoper
        elseif shopperGroup then
            ShoperMain[player] = FirstOfGroup(shopperGroup)
        end
        if shopperGroup then
            GroupClear(Shoper[player])
            -- when a group was given
            if string.sub(tostring(shopperGroup), 1, 6) == "group:" then
                BlzGroupAddGroupFast(shopperGroup, Shoper[player])
            end
        end

        GroupAddUnit(Shoper[player], mainShoper)

        local oldSize = TasItemFusion.Player[player].UseAble.Count
        TasItemFusionGetUseableItems(player, Shoper[player], not sharedItems)
        
        if oldSize ~= TasItemFusion.Player[player].UseAble.Count then
            
            CurrentOffSetInventory[player] = 0
        end
        if isNewShopType then
            -- has to unmark buyAble
            local buttonList = TasItemShopUI.ButtonList
            local shopObject = TasItemShopUI.Shops[GetUnitTypeId(shop)]
            BUY_ABLE_ITEMS.Marker[player] = {}
            
            TasButtonListClearData(buttonList, player)
            -- has custom Shop Data?
            if shopObject then
                -- WhiteListMode?
                if shopObject.Mode then
                    for i, v in ipairs(shopObject) do
                        TasButtonListAddData(buttonList, v, player)
                        BUY_ABLE_ITEMS.Marker[player][v] = true
                    end
                else
                    -- BlackListMode
                    for i, v in ipairs(BUY_ABLE_ITEMS) do
                        if type(v) == "string" then
                            if not shopObject[FourCC(v)] then
                                TasButtonListAddData(buttonList, FourCC(v), player)
                                BUY_ABLE_ITEMS.Marker[player][FourCC(v)] = true
                            end
                        elseif type(v) == "number" then
                            if not shopObject[v] then
                                TasButtonListAddData(buttonList, v, player)
                                BUY_ABLE_ITEMS.Marker[player][v] = true
                            end
                        end
                    end
                end
            else
                -- none custom Shop, add all data.
                for i, v in ipairs(BUY_ABLE_ITEMS) do
                    if type(v) == "string" then
                        BUY_ABLE_ITEMS.Marker[player][FourCC(v)] = true
                        TasButtonListAddData(buttonList, FourCC(v), player)
                    elseif type(v) == "number" then
                        TasButtonListAddData(buttonList, v, player)
                        BUY_ABLE_ITEMS.Marker[player][v] = true
                    end
                end
            end
        end
        if GetLocalPlayer() == player then
            if IsUnitType(ShoperMain[player], UNIT_TYPE_HERO) then
                BlzFrameSetText(TasItemShopUI.Frames.TitelText, GetUnitName(shop) .. " - ".. GetHeroProperName(ShoperMain[player]))
            else
                BlzFrameSetText(TasItemShopUI.Frames.TitelText, GetUnitName(shop) .. " - ".. GetUnitName(ShoperMain[player]))
            end
            
            LocalShopObject = TasItemShopUI.Shops[GetUnitTypeId(shop)]
            if isNewShopType then
                TasButtonListSearch(TasItemShopUI.ButtonList)
            end
        end
        UpdateTasButtonList(TasItemShopUI.ButtonList)
        setSelected(player, TasItemShopUI.Selected[player])
        setSelectedItem(player, TasItemShopUI.SelectedItem[player])
    else
        CurrentShop[player] = nil
        if canUndo then
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


function TasItemShopUIShowSimple(player, shop, mainShoper)
    TasItemShopUIShow(player, shop, nil, mainShoper)
end
    local function RefButtonPageChange(current, add, min, max, player)
        local size = math.abs(add)
        if BlzGetTriggerFrameEvent() == FRAMEEVENT_CONTROL_CLICK then
            current = current + add
            if not refButtonPageRotate then
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
    local function RefButtonAction(itemCode)
        local player = GetTriggerPlayer()
        local frame = BlzGetTriggerFrame()

        if BlzGetTriggerFrameEvent() == FRAMEEVENT_CONTROL_CLICK then
        -- print(GetPlayerName(player), "Clicked Material", index)
            setSelected(player, itemCode)
        else
            if IsRightClick(player) then
                ShowSprite(frame, player)
                StartSoundForPlayerBJ(player, ToggleIconButton.Sound)
                BuyItem(player, itemCode)
            end
        end
    end
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
            ShowSprite(BlzGetTriggerFrame(), player)
            BuyItem(player, itemCode)
        end)

        TasItemShopUI.TriggerMaterial = CreateTriggerEx(function()
            local player = GetTriggerPlayer()
            local itemCode = TasItemShopUI.Selected[player]
            local index = tonumber(BlzFrameGetText(BlzGetTriggerFrame())) + CurrentOffSetMaterial[player]
            RefButtonAction(TasItemFusion.BuiltWay[itemCode].Mats[index])

        end)

        TasItemShopUI.TriggerMaterialPage = CreateTriggerEx(function()
            local player = GetTriggerPlayer()
            local itemCode = TasItemShopUI.Selected[player]
            local max = #TasItemFusion.BuiltWay[itemCode].Mats
            local min = 0
            local add = TasItemShopUI.Frames[BlzGetTriggerFrame()]
            
            CurrentOffSetMaterial[player] = RefButtonPageChange(CurrentOffSetMaterial[player], add, min, max, player)
            if GetLocalPlayer() == player then
                updateRefButtons(TasItemFusion.BuiltWay[itemCode].Mats, TasItemShopUI.Frames.BoxMaterial, TasItemShopUI.Frames.Material, CurrentOffSetMaterial[player])
                updateHaveMats(player, itemCode)
            end
        end)

        TasItemShopUI.TriggerUpgrade = CreateTriggerEx(function()
            local player = GetTriggerPlayer()
            local itemCode = TasItemShopUI.Selected[player]
            local index = tonumber(BlzFrameGetText(BlzGetTriggerFrame())) + CurrentOffSetUpgrade[player]
            RefButtonAction(TasItemFusion.UsedIn[itemCode][index].Result)
        end)

        

        TasItemShopUI.TriggerUpgradePage = CreateTriggerEx(function()
            local player = GetTriggerPlayer()
            local itemCode = TasItemShopUI.Selected[player]
            local max = #TasItemFusion.UsedIn[itemCode]
            local min = 0
            local add = TasItemShopUI.Frames[BlzGetTriggerFrame()]
            
            CurrentOffSetUpgrade[player] = RefButtonPageChange(CurrentOffSetUpgrade[player], add, min, max, player)
            if GetLocalPlayer() == player then
                updateRefButtons(TasItemFusion.UsedIn[itemCode], TasItemShopUI.Frames.BoxUpgrades, TasItemShopUI.Frames.Upgrades, CurrentOffSetUpgrade[player])
            end
        end)

        TasItemShopUI.TriggerQuickLink = CreateTriggerEx(function()
            local player = GetTriggerPlayer()
            local index = tonumber(BlzFrameGetText(BlzGetTriggerFrame())) + CurrentOffSetQuickLink[player]
            local itemCode = TasItemShopUI.QuickLink[player][index]
            if TasItemShopUI.QuickLinkKeyActive[player] and BlzGetTriggerFrameEvent() == FRAMEEVENT_CONTROL_CLICK then
                TasItemShopUI.SetQuickLink(player, itemCode)
            else
                RefButtonAction(itemCode)
            end
            
        end)

        TasItemShopUI.TriggerQuickLinkPage = CreateTriggerEx(function()
            local player = GetTriggerPlayer()
            local max = #TasItemShopUI.QuickLink[player]
            local min = 0
            local add = TasItemShopUI.Frames[BlzGetTriggerFrame()]
            
            CurrentOffSetQuickLink[player] = RefButtonPageChange(CurrentOffSetQuickLink[player], add, min, max, player)
            if GetLocalPlayer() == player then
                updateRefButtons(TasItemShopUI.QuickLink[player], TasItemShopUI.Frames.BoxQuickLink, TasItemShopUI.Frames.QuickLink, CurrentOffSetQuickLink[player])
            end          
        end)

        TasItemShopUI.TriggerInventory = CreateTriggerEx(function()
            local player = GetTriggerPlayer()
            local frame = BlzGetTriggerFrame()
            local index = tonumber(BlzFrameGetText(frame)) + CurrentOffSetInventory[player]
            local item
            if inventoryShowMainOnly then
                -- warcraft inventory starts with 0 but button indexes with 1
                item = UnitItemInSlot(ShoperMain[player], index - 1)
            else
                item = TasItemFusion.Player[player].UseAble[index]
            end
            local itemCode = GetItemTypeId(item)
            
            -- prevent a possible desync when the inventory item was not given to TasItemCost yet. TasItemCost creates and destroys an item when a new type is given.
            TasItemCaclCost(itemCode)

            if BlzGetTriggerFrameEvent() == FRAMEEVENT_CONTROL_CLICK then
            -- print(GetPlayerName(player), "Clicked Material", index)
                setSelected(player, itemCode)
                setSelectedItem(player, item)
            else
                if IsRightClick(player) then
                    ShowSprite(frame, player)
                    StartSoundForPlayerBJ(player, ToggleIconButton.Sound)
                    if canSellItems and inventoryRightClickSell then
                        SellItem(player, item)
                    else
                        BuyItem(player, itemCode)
                        setSelectedItem(player, item)
                    end
                end
            end
            
        end)

        TasItemShopUI.TriggerInventoryPage = CreateTriggerEx(function()
            local player = GetTriggerPlayer()
            local max = TasItemFusion.Player[player].UseAble.Count
            local min = 0
            local add = TasItemShopUI.Frames[BlzGetTriggerFrame()]
            
            CurrentOffSetInventory[player] = RefButtonPageChange(CurrentOffSetInventory[player], add, min, max, player)
            
            if GetLocalPlayer() == player then
                updateRefButtons(TasItemFusion.Player[player].UseAble, TasItemShopUI.Frames.BoxInventory, TasItemShopUI.Frames.Inventory, CurrentOffSetInventory[player])
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
            TasItemShopUIShow(player, CurrentShop[player])
            if GetLocalPlayer() == player then
                
                if #TasItemShopUI.Undo[GetLocalPlayer()] > 0 then
                    BlzFrameSetVisible(TasItemShopUI.Frames.BoxUndo, true)
                    updateUndoButton(TasItemShopUI.Undo[player][#TasItemShopUI.Undo[player]].Result, TasItemShopUI.Undo[player][#TasItemShopUI.Undo[player]].ActionName)
                else
                    BlzFrameSetVisible(TasItemShopUI.Frames.BoxUndo, false)
                end
            end
        end, print)
        end)

        TasItemShopUI.TriggerSell = CreateTriggerEx(function()
            SellItem(GetTriggerPlayer(), TasItemShopUI.SelectedItem[GetTriggerPlayer()])
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
            if canUndo then
                undo = {ResultItem = {}, Result = itemCode, Gold = -gold, Lumber = -lumber, Items = {}, ActionName = GetLocalizedString(textDefuse)}
                table.insert(TasItemShopUI.Undo[player], undo)
                for i = 0, BlzGroupGetSize(Shoper[player]) - 1, 1 do
                    owner = BlzGroupUnitAt(Shoper[player], i)
                    if UnitHasItem(owner, item) then
                        UnitRemoveItem(owner, item)
                        SetItemVisible(item, false)
                        undo.Items[1] = {item, owner}
                        break
                    end
                end
                
                if GetLocalPlayer() == player then
                    BlzFrameSetVisible(TasItemShopUI.Frames.BoxUndo, true)
                    updateUndoButton(undo.Result, GetLocalizedString(textDefuse))
                end
            else
                RemoveItem(item)
            end

            for i, v in ipairs(TasItemFusion.BuiltWay[itemCode].Mats) do
                item = CreateItem(v, GetUnitX(ShoperMain[player]), GetUnitY(ShoperMain[player]))
                GiveItemGroup(player, item, undo)
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
                if not range then range = shopRange end
                GroupEnumUnitsInRange(tempGroup, GetUnitX(shop), GetUnitY(shop), range + 400, nil)
                -- remove unallowed shoppers
                
                ForGroup(tempGroup, function()
                    if not IsValidShopper(player, shop, GetEnumUnit(), range) then
                        GroupRemoveUnit(tempGroup, GetEnumUnit())
                    end
                end)
                if not target and IsUnitInGroup(ShoperMain[player], tempGroup) then
                    target = ShoperMain[player]
                end
                
                TasItemShopUIShow(player, shop, tempGroup, target)
            -- no, end shopping!
            elseif CurrentShop[player] then
                TasItemShopUIShow(player)
            end
        end, print)
        end
        TasItemShopUI.TriggerSelect = CreateTriggerEx(function()
            ShopSelectionAction(GetTriggerPlayer(), GetTriggerUnit())
        end)
        TriggerRegisterAnyUnitEventBJ(TasItemShopUI.TriggerSelect, EVENT_PLAYER_UNIT_SELECTED)

        if userButtonOrder then
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
            local index = tonumber(BlzFrameGetText(BlzGetTriggerFrame())) + CurrentOffSetUser[player]
            local unit = BlzGroupUnitAt(Shoper[player], index - 1)

            if BlzGetTriggerFrameEvent() == FRAMEEVENT_CONTROL_CLICK then
                if not userButtonOrder then
                    ShopSelectionAction(player, CurrentShop[player], unit)
                end
                IssueNeutralTargetOrder(player, CurrentShop[player], "smart", unit)
            else
                if IsRightClick(player) then
                    SelectUnitForPlayerSingle(unit, player)
                end
            end
        end)

        TasItemShopUI.TriggerUserPage = CreateTriggerEx(function()
            local player = GetTriggerPlayer()
            local max = BlzGroupGetSize(Shoper[player])
            local min = 0
            local add = TasItemShopUI.Frames[BlzGetTriggerFrame()]
            CurrentOffSetUser[player] = RefButtonPageChange(CurrentOffSetUser[player], add, min, max, player)
            
            if GetLocalPlayer() == player then
                updateRefButtons(Shoper[player], TasItemShopUI.Frames.BoxUser, TasItemShopUI.Frames.User, CurrentOffSetUser[player])
                updateOverLayMainSelected(player)
            end
            
        end)

        TasItemShopUI.TriggerESC = CreateTriggerEx(function()
            TasItemShopUIShow(GetTriggerPlayer())
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
            if refButtonCountQuickLink > 0 and GetTriggerPlayer() == GetLocalPlayer() then
                BlzFrameSetVisible(TasItemShopUI.Frames.QuickLinkHighLight, true)
            end
        end)
        TasItemShopUI.TriggerReleaseShift = CreateTriggerEx(function()
            --print("Release Shift")
            TasItemShopUI.QuickLinkKeyActive[GetTriggerPlayer()] = false
            if refButtonCountQuickLink > 0 and GetTriggerPlayer() == GetLocalPlayer() then
                BlzFrameSetVisible(TasItemShopUI.Frames.QuickLinkHighLight, false)
            end
        end)
        

        local tempUnits = {Count = 0}
        TimerStart(CreateTimer(), updateTime, true, function()
          --  xpcall(function()
          if posScreenRelative then
            --credits to ScrewTheTrees(Fred) & Niklas
            BlzFrameSetSize(TasItemShopUI.Frames.Fullscreen, BlzGetLocalClientWidth()/BlzGetLocalClientHeight()*0.6, 0.6)
          end
            local player, unit
            for i = 0, bj_MAX_PLAYER_SLOTS - 1 do
                player = Player(i)
                
                if CurrentShop[player] then
                    ShopSelectionAction(player, CurrentShop[player])
                end
            end
        --end, print)
        end)
        --call the function handling custom User setup
        xpcall(UserInit, print)
        --precalc any added Item
        for i = 1, #BUY_ABLE_ITEMS do
           -- if type(BUY_ABLE_ITEMS[i]) == "string" then BUY_ABLE_ITEMS[i] = FourCC(BUY_ABLE_ITEMS[i]) end
            TasItemCaclCost(BUY_ABLE_ITEMS[i])
        end
        

        local player
        BUY_ABLE_ITEMS.Marker = {}
        for i = 0, bj_MAX_PLAYER_SLOTS - 1 do
            player = Player(i)
            Shoper[player] = CreateGroup()
            TasItemShopUI.Undo[player] = {}
            BUY_ABLE_ITEMS.Marker[player] = {}
            TriggerRegisterPlayerEventEndCinematic(TasItemShopUI.TriggerESC, player)
            TasItemShopUI.QuickLink[player] = {}
            if quickLinkKey then
                --"none"(0), "shift"(1), "control"(2), "alt"(4) and "META"(8) (windows key)
                --1 + 2 + 4 + 8 = 15
                for meta = 0, 15 do
                    BlzTriggerRegisterPlayerKeyEvent(TasItemShopUI.TriggerPressShift, player, quickLinkKey, meta, true)
                    BlzTriggerRegisterPlayerKeyEvent(TasItemShopUI.TriggerReleaseShift, player, quickLinkKey, meta, false)
                end
            end
        end

        TasItemShopUI.Create()
        -- Frame related code actions are not saved/Loaded, probably repeat them after Loading the game
        if FrameLoaderAdd then FrameLoaderAdd(TasItemShopUI.Create) end
        
    end, print)
end

end
