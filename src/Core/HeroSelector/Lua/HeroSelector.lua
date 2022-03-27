--[[
HeroSelector V1.6a

------
This functions are found directly below the config and belong to the config.
They also can be hooked but you might lose the default. Could do it like it is done in TeamViewer create a Backup of the current then overwrite it and call the backup in the replacement.

function HeroSelector.unitCreated(player, unitCode, isRandom)
    this function is called when an unit is picked, add here you actions that have to be done for the picked unit

function HeroSelector.buttonSelected(player, unitCode)
    this function is called when an player selects an button, this is not the picking.

function HeroSelector.unitBaned(player, unitCode)
    this function is called when a player bans an unitCode.

function HeroSelector.repick(unit[, player])
    if player is skiped unit owner sees the selection
    this will remove the unit from the game.
    Adds thie unitcode of the unit to the randompool

function HeroSelector.autoDetectCategory(unitCode)
    this called on every unit added. It is a good place for simple automatic categorizes, on default it categorizes melee as 1 and ranged as 2.

function HeroSelector.initHeroes()
    this function will be called before anything is created, when not using GUI to setup data you could add the selectable heroes here.
------
How use the Selection grid?
Each hero can only be once in the grid. When using HeroSelector.addUnit it will add a new slot. There are HeroSelector.ButtonColCount*HeroSelector.ButtonRowCount slots.
3 rows with 4 cols would result into:
01 02 03 04
05 06 07 08
09 10 11 12

When you want to leave fields in the grid empty use HeroSelector.addUnit(0) or HeroSelector.addUnit().
There is a GUI setup which works with indexes, not set indexes will be empty fields.
------
function HeroSelector.setUnitReq(unitCode, who)
    adds an requirement: can be a player, a force, a teamNumber, a race, a table {techcode, level}, skip who or nil will remove an requirment.
    Only when the local player fullfills than he can click the button.
    calling this will not update the selected buttonIndex of players nor does this update the clickability.
    To update the clickability when setting requirments after the Box was created use HeroSelector.update() and deselect indexes
    won't work when the unitCode wasn't added yet.
    
function HeroSelector.addUnit([unitCode, onlyRandom, requirement])
    can be called without arguments to hava a empty slot calling it with 0 has the same effect
    requirement works like who in HeroSelector.setUnitReq.

function HeroSelector.setUnitCategory(unitCode, category)
    sets the category of an added Option.
    Category should be a power 2 number. 1 2 4 8 16 32 ....

function HeroSelector.addUnitCategory(unitCode, category)
    Keeps previous setings untouched

function HeroSelector.addCategory(icon, text)
    icon is the enabled image, text is the tooltip text.

function HeroSelector.clearUnitData()
    removes all current UnitData this includes limit-counters, requirements, categories.

function HeroSelector.show(flag, [who])
    Shows/Hides HeroSelector to who
    flag = true show it, false = hide it
    who can be a player, a force, a teamNumber, a race or nothing = anyone
    teamNumbers are the warcraft 3 given teamNumbers starting with 0 for team 1.
    the force is expected to be kept alive

function HeroSelector.setFrameText(frame, text[, who])
    uses BlzFrameSetText onto frame when the local player is included in who by the rules of function HeroSelector.includesPlayer
function HeroSelector.setTitleText(text[, who])
    wrapper HeroSelector.setFrameText
function HeroSelector.setBanButtonText(text[, who])
    wrapper HeroSelector.setFrameText
function HeroSelector.setAcceptButtonText(text[, who])
    wrapper HeroSelector.setFrameText

function HeroSelector.enablePick(flag[, who])
    enable/disable the accept/random button also makes them visible for that players and hides the ban Button.
    
function HeroSelector.enableBan(flag[, who])
    enable/disable the ban button also makes accept/random invisible for that players and shows the ban Button.

function HeroSelector.forceRandom([who])
    wrapper for doRandom for player

function HeroSelector.forcePick([who])
    forces to pick what currently is selected, if that fails doRandom

function HeroSelector.buttonRequirementDone(unitCode, player)

function HeroSelector.deselectButtons([buttonIndex])
    deselect selected buttons for all players with 0 or nil
    when an index is given only this specific buttonIndex

function HeroSelector.update()
    reDo possible selection, textures and enability for all heroButtons.

function HeroSelector.destroy()
    destroys and nil HeroSelector

function HeroSelector.getDisabledIcon(icon)
    ReplaceableTextures\CommandButtons\BTNHeroPaladin.tga -> ReplaceableTextures\CommandButtonsDisabled\DISBTNHeroPaladin.tga

function HeroSelector.showFrame(frame, flag[, who])
    Set the visibility of frame to flag when who includes the local player by the rules of function HeroSelector.includesPlayer

function HeroSelector.includesPlayer(who, player)
    does player include who?
    return true, if yes.
    return false otherwise
    who can be a number(GetPlayerTeam), a race(GetPlayerRace), a player, a force(BlzForceHasPlayer) or
    nil => true    

function HeroSelector.counterChangeUnitCode(unitCode, add, player)
    increases/decreases the counter for picks of unitCode for the player's team.
    This can allow/disallow picking this unit for that team.
function HeroSelector.counterSetUnitCode(unitCode, set, player)
    sets the counter for picks of unitCode for the player's team.
    This can allow/disallow picking this unit for that team.
    
function HeroSelector.frameLoseFocus(frame)
    this disables & enables frame for the local player to free current focus (enable hotkeys, chat ...).

function HeroSelector.rollOption(player, includeRandomOnly, excludedIndex, category)
    get an random Unitcode from the added options
    returns an unitcode or nil when none could be found
--]]
HeroSelector = {}

--Box
HeroSelector.BoxFrameName           = "HeroSelectorRaceBox" --this is the background box being created
HeroSelector.BoxPosX                = 0.4
HeroSelector.BoxPosY                = 0.4
HeroSelector.BoxPosPoint            = FRAMEPOINT_CENTER
HeroSelector.AutoShow               = false --(true) shows the box and the Selection at 0.0 for all players
--Unique Picks
HeroSelector.UnitCount              = 2 --each hero is in total allowed to be picked this amount of times (includes random, repicking allows a hero again).
HeroSelector.UnitCountPerTeam       = 1 --Each Team is allowed to pick this amount of each unitType
HeroSelector.ToManyTooltip          = "OUTOFSTOCKTOOLTIP"
--Ban
HeroSelector.DelayBanUntilPick      = false --(true) baning will not be applied instantly, instead it is applied when HeroSelector.enablePick is called the next time.
--Category
HeroSelector.CategoryData = {
    --Icon path, tooltip Text (tries to localize)
    {"ReplaceableTextures\\CommandButtons\\BTNSteelMelee", "MELEE"},                 --1, automatic detected when adding an unit
    {"ReplaceableTextures\\CommandButtons\\BTNHumanMissileUpOne", "Ranged"},         --2, automatic detected when adding an unit
    {"ReplaceableTextures\\CommandButtons\\BTNGauntletsOfOgrePower", "STRENGTH"},    --4
    {"ReplaceableTextures\\CommandButtons\\BTNSlippersOfAgility", "AGILITY"},        --8
    {"ReplaceableTextures\\CommandButtons\\BTNMantleOfIntelligence", "INTELLECT"},   --16
}
HeroSelector.CategoryAffectRandom   = true  --(false) random will not care about selected category
HeroSelector.CategoryMultiSelect    = true  --(false) deselect other category when selecting one, (true) can selected multiple categories and all heroes having any of them are not filtered.
HeroSelector.CategoryMultiMatchAll  = true  --(false) hero must match all categories
HeroSelector.CategorySize           = 0.02  --the size of the Category Button
HeroSelector.CategorySpaceX         = 0.0008 --space between 2 category Buttons, it is meant to need only one line of Categoryy Buttons.
HeroSelector.CategoryFilteredAlpha  = 45     -- Alpha value of Heroes being filtered by unselected categories
HeroSelector.CategoryAutoDetectHero = false  -- Will create and remove added Heroes to setup the Category for the primary Attribute Str(4) Agi(8) Int(16)   

--Indicator
HeroSelector.IndicatorPathPick      = "UI\\Feedback\\Autocast\\UI-ModalButtonOn.mdl" --this model is used by the indicator during picking
HeroSelector.IndicatorPathBan       = "war3mapImported\\HeroSelectorBan.mdl" --this model is used by the indicator during baning
--Grid
HeroSelector.SpaceBetweenX          = 0.004 --space between 2 buttons in one row
HeroSelector.SpaceBetweenY          = 0.004 --space between 2 rows
HeroSelector.ButtonColCount         = 15 --amount of buttons in one row
HeroSelector.ButtonRowCount         = 5 --amount of rows
HeroSelector.ChainedButtons         = true --(true) connect to the previous button/ or row, (false) have a offset to the box topLeft in this moving a button has no effect on other buttons.
--Button
HeroSelector.ButtonSize             = 0.03 --size of each button
HeroSelector.ButtonBlendAll         = false --(true) when a hero icon uses transparenzy
HeroSelector.EmptyButtonPath        = "UI\\Widgets\\EscMenu\\Human\\blank-background.blp"
HeroSelector.HideEmptyButtons       = true
--Ban Button
HeroSelector.BanButtonTextPrefix    = "|cffcf2084" --Prefix Text for the Ban Button
HeroSelector.BanButtonText          = "CHAT_ACTION_BAN" --tries to get a Localized String
HeroSelector.BanButtonSizeX         = 0.13
HeroSelector.BanButtonSizeY         = 0.03
HeroSelector.BanTooltip             = "DISALLOWED"
HeroSelector.BanIgnoreRequirment    = true -- (true) Ban is not restricted by Requirments
--Accept Button
HeroSelector.AcceptButtonTextPrefix = ""
HeroSelector.AcceptButtonText       = "ACCEPT"
HeroSelector.AcceptButtonSizeX      = 0.085
HeroSelector.AcceptButtonSizeY      = 0.03
HeroSelector.AcceptButtonIsShown    = true
HeroSelector.AcceptButtonAnchor     = FRAMEPOINT_BOTTOMRIGHT --places the Accept button with which Point to the bottom, with right he is at the left
--Random Button
HeroSelector.RandomButtonTextPrefix = ""
HeroSelector.RandomButtonText       = "RANDOM" --tries Localizing
HeroSelector.RandomButtonSizeX      = 0.085
HeroSelector.RandomButtonSizeY      = 0.03
HeroSelector.RandomButtonIsShown    = true
HeroSelector.RandomButtonAnchor     = FRAMEPOINT_BOTTOMLEFT
HeroSelector.RandomButtonPick       = false --(true) pressing the random button will pick the option. (false) pressing the random button will select a button, random only heroes can not be selected, but that does not matter. This weak random and randomonly should not be combined.
--Tooltip
HeroSelector.TooltipPrefix          = "|cffffcc00"
HeroSelector.TooltipOffsetX         = 0
HeroSelector.TooltipOffsetY         = 0
HeroSelector.TooltipPoint           = FRAMEPOINT_BOTTOM --pos the Tooltip with which Point
HeroSelector.TooltipRelativePoint   = FRAMEPOINT_TOP --pos the Tooltip to which Point of the Relative
HeroSelector.TooltipRelativIsBox    = false          --(true) use the box as anchor, (false) use the button as anchor
HeroSelector.TooltipRequires        = "QUESTCOMPONENTS"

--Border
HeroSelector.BorderSize = {}
HeroSelector.BorderSize[RACE_HUMAN]     = 0.029 --border size seen by Race Human, this is needed cause the borders are different in size.
HeroSelector.BorderSize[RACE_ORC]       = 0.029
HeroSelector.BorderSize[RACE_UNDEAD]    = 0.035
HeroSelector.BorderSize[RACE_NIGHTELF]  = 0.035
HeroSelector.BorderSize[RACE_DEMON]     = 0.024

--This runs before the box is created with that the system has the needed data right when it is needed.
--you can add units somewhere else but it is done after the box was created you have to use the update function to update the textures of shown buttons
function HeroSelector.initHeroes()
    --create categories setuped in config
    local categories = HeroSelector.CategoryData
    HeroSelector.Category = {}
    for index, value in ipairs(categories)
    do
       HeroSelector.addCategory(value[1], value[2])
    end

    --read GUI, when the variable exist
    if udg_HeroSelectorUnitCode then
        local index = 1
        --add from index 1 all random only heroes
        while udg_HeroSelectorRandomOnly[index] ~= 0 do
            HeroSelector.addUnit(udg_HeroSelectorRandomOnly[index], true)
            index = index + 1
        end

        --copy the setuped field
        for index = 1, HeroSelector.ButtonColCount*HeroSelector.ButtonRowCount,1 do
            HeroSelector.addUnit(udg_HeroSelectorUnitCode[index])
            if udg_HeroSelectorCategory[index] ~= 0 then
                HeroSelector.addUnitCategory(udg_HeroSelectorUnitCode[index], udg_HeroSelectorCategory[index])
            end
        end

        --kill the tables
        udg_HeroSelectorUnitCode = nil
        udg_HeroSelectorRandomOnly = nil
        udg_HeroSelectorCategory = nil
    end
    --adding further units when using the GUI Array does not make much sense, except you would add rows.

    --skip further demo code
    if true then return end


    HeroSelector.addUnit("Hgam", true, 0) --antonidas is an only random Hero that can only be randomed by team 0 (for users 1).
    HeroSelector.addUnit("Eevi", true, 1) --evil Illidan is an only random Hero that can only be randomed by team 1 (for users 2).
    
    --Adds requirments
    --when you have a ban phase it might be better to add the requirments after the ban phase is over, otherwise one can only ban own options.
    --human only work for human, as nightelf only for Nightelf
    HeroSelector.setUnitReq('Hpal', RACE_HUMAN)
    HeroSelector.setUnitReq('Hamg', RACE_HUMAN)
    HeroSelector.setUnitReq('Hblm', RACE_HUMAN)
    HeroSelector.setUnitReq('Hmkg', RACE_HUMAN)
    --HeroSelector.setUnitReq('Ofar', RACE_ORC)
    --HeroSelector.setUnitReq('Oshd', RACE_ORC)
    --HeroSelector.setUnitReq('Otch', RACE_ORC)
    --HeroSelector.setUnitReq('Obla', RACE_ORC)
    HeroSelector.setUnitReq('Emoo', RACE_NIGHTELF)
    HeroSelector.setUnitReq('Edem', RACE_NIGHTELF)
    HeroSelector.setUnitReq('Ekee', RACE_NIGHTELF)
    HeroSelector.setUnitReq('Ewar', RACE_NIGHTELF)
    --HeroSelector.setUnitReq('Udea', RACE_UNDEAD)
    --HeroSelector.setUnitReq('Ulic', RACE_UNDEAD)
    --HeroSelector.setUnitReq('Udre', RACE_UNDEAD)
    --HeroSelector.setUnitReq('Ucrl', RACE_UNDEAD)
    --[[
    local categoryMelee = 1 --autodetected
    local categoryRanged = 2 --autodetected
    local categoryStr = 4
    local categoryAgi = 8
    local categoryInt = 16
    HeroSelector.addUnitCategory('Hpal', categoryStr)
    HeroSelector.addUnitCategory('Hamg', categoryInt)
    HeroSelector.addUnitCategory('Hblm', categoryInt)
    HeroSelector.addUnitCategory('Hmkg', categoryStr)
    HeroSelector.addUnitCategory('Ofar', categoryInt)
    HeroSelector.addUnitCategory('Oshd', categoryAgi)
    HeroSelector.addUnitCategory('Otch', categoryAgi)
    HeroSelector.addUnitCategory('Obla', categoryAgi)
    HeroSelector.addUnitCategory('Emoo', categoryAgi)
    HeroSelector.addUnitCategory('Edem', categoryAgi)
    HeroSelector.addUnitCategory('Ekee', categoryInt)
    HeroSelector.addUnitCategory('Ewar', categoryAgi)
    HeroSelector.addUnitCategory('Udea', categoryStr)
    HeroSelector.addUnitCategory('Ulic', categoryInt)
    HeroSelector.addUnitCategory('Udre', categoryStr)
    HeroSelector.addUnitCategory('Ucrl', categoryStr)

    HeroSelector.setUnitCategory('Hgam', categoryInt + categoryRanged)
    HeroSelector.setUnitCategory("Eevi", categoryAgi + categoryMelee)
    --]]
    
    --[[
    HeroSelector.addUnit('Hpal') --add paladin as selectable Hero
    HeroSelector.addUnit('Hamg')
    HeroSelector.addUnit('Hblm')
    HeroSelector.addUnit('Hmkg')
    HeroSelector.addUnit("Obla", true) --this unit can only be randomed
    HeroSelector.addUnit("Ofar")
    HeroSelector.addUnit("Otch", 1) --this unit can only be randomed
    HeroSelector.addUnit() --this is an empty box. It still takes a slot.
    HeroSelector.addUnit() --this is an empty box. It still takes a slot.
    HeroSelector.addUnit("Oshd")
    HeroSelector.addUnit("Edem")
    HeroSelector.addUnit() --this is an empty box. It still takes a slot.
    HeroSelector.addUnit() --this is an empty box. It still takes a slot.
    HeroSelector.addUnit("Ekee")
    HeroSelector.addUnit("Emoo")
    HeroSelector.addUnit("Ewar",true)
    HeroSelector.addUnit("Udea")
    HeroSelector.addUnit("Ulic")
    HeroSelector.addUnit("Udre")
    HeroSelector.addUnit("Ucrl",1)
    --]]
end

function HeroSelector.autoDetectCategory(unitCode)
    if IsUnitIdType(unitCode, UNIT_TYPE_MELEE_ATTACKER) then
        HeroSelector.UnitData[unitCode].Category = 1
    elseif IsUnitIdType(unitCode, UNIT_TYPE_RANGED_ATTACKER) then
        HeroSelector.UnitData[unitCode].Category = 2
    end
    if HeroSelector.CategoryAutoDetectHero and IsUnitIdType(unitCode, UNIT_TYPE_HERO) then
        local unit = CreateUnit(Player(bj_PLAYER_NEUTRAL_EXTRA), unitCode, 0, 0, 270)
        local primaryAttribute = BlzGetUnitIntegerField(unit, UNIT_IF_PRIMARY_ATTRIBUTE)
        RemoveUnit(unit)
        if ConvertHeroAttribute(primaryAttribute) == HERO_ATTRIBUTE_STR then
            HeroSelector.UnitData[unitCode].Category = HeroSelector.UnitData[unitCode].Category + 4
        elseif ConvertHeroAttribute(primaryAttribute) == HERO_ATTRIBUTE_AGI then
            HeroSelector.UnitData[unitCode].Category = HeroSelector.UnitData[unitCode].Category + 8
        elseif ConvertHeroAttribute(primaryAttribute) == HERO_ATTRIBUTE_INT then 
            HeroSelector.UnitData[unitCode].Category = HeroSelector.UnitData[unitCode].Category + 16
        end
    end
end

--what happens to the unit beeing picked, player is the one having pressed the button
function HeroSelector.unitCreated(player, unitCode, isRandom)
    bj_lastCreatedUnit = CreateUnit(player, unitCode, GetPlayerStartLocationX(player), GetPlayerStartLocationY(player), 0)
    local unit = bj_lastCreatedUnit
    if isRandom then
        --randomed
    else
        --picked
    end

    if player == Player(1) then
                
    end

    PanCameraToTimedForPlayer(player, GetUnitX(unit), GetUnitY(unit),0)
    SelectUnitForPlayerSingle(unit, player)
    HeroSelector.enablePick(false, player) --only one pick for this player

    if globals and globals.udg_HeroSelectorEvent then
        globals.udg_HeroSelectorEvent = 0
        globals.udg_HeroSelectorEvent = 1.0
    end
    --print(GetPlayerName(player),"picks",GetUnitName(unit))
end

--happens when the banButton is pressed, player is the one having pressed the button
function HeroSelector.unitBaned(player, unitCode)
    HeroSelector.enableBan(false, player) --only one ban
    --print(GetPlayerName(player),"bans",GetObjectName(unitCode))
end

function HeroSelector.buttonSelected(player, unitCode)
    --player who pressed the button
    --unitCode the unitCode selected
    --this is not picked.

    --print(GetPlayerName(player),"selects",GetObjectName(unitCode))
end

function HeroSelector.repick(unit, player)
    UnitRemoveBuffsBJ(bj_REMOVEBUFFS_ALL, unit) --this is done to undo metamorph
    local unitCode = GetUnitTypeId(unit)
    if unitCode == 0 then return end

    HeroSelector.counterChangeUnitCode(unitCode, -1, player)

    if not player then
        player = GetOwningPlayer(unit)
    end
    HeroSelector.show(true, player)
    HeroSelector.enablePick(true, player)
    RemoveUnit(unit)
end
--=====
--code start
--=====
HeroSelector.UnitData = {} --all avaiable selections
HeroSelector.UnitDataPool = {} -- all possible random values
HeroSelector.BanDelayed = {}

function HeroSelector.CategoryClickAction()
    local button = BlzGetTriggerFrame()
    local category = HeroSelector.CategoryButton[button]
    HeroSelector.frameLoseFocus(BlzGetTriggerFrame())
    local player = GetTriggerPlayer()
    local playerData = HeroSelector.Category[player] 
    if not playerData then
        playerData = 0
    end
    --has this category already?
    if BlzBitAnd(playerData, category.Value) ~= 0 then
        --yes, unable
        playerData = playerData - category.Value
        if GetLocalPlayer() == player then
            BlzFrameSetTexture(category.Icon, category.TextureDisabled, 0, true)
            BlzFrameSetTexture(category.IconPushed, category.TextureDisabled, 0, true)
        end

    else
        if not HeroSelector.CategoryMultiSelect and HeroSelector.CategoryButton[player]  then
            local lastCategory = HeroSelector.CategoryButton[player]
            BlzFrameSetTexture(lastCategory.Icon, lastCategory.TextureDisabled, 0, true)
            BlzFrameSetTexture(lastCategory.IconPushed, lastCategory.Texture, 0, true)
            if playerData ~= 0 then
                playerData = 0
            end
        end
        
        --no, enable
        playerData = playerData + category.Value
        if GetLocalPlayer() == player then
            BlzFrameSetTexture(category.Icon, category.Texture, 0, true)
            BlzFrameSetTexture(category.IconPushed, category.Texture, 0, true)
        end
        HeroSelector.CategoryButton[player] = category
    end
    
    HeroSelector.Category[player] = playerData

    if GetLocalPlayer() == player then
        --update all buttons
        --buttons not having at least 1 selected category becomes partly transparent
        for buttonIndex, value in ipairs(HeroSelector.HeroButtons)
        do
            local button = HeroSelector.HeroButtons[buttonIndex].Frame
            local unitCode = HeroSelector.UnitData[buttonIndex]
            if unitCode and unitCode > 0 then
                local filter = BlzBitAnd(HeroSelector.UnitData[unitCode].Category, playerData)
                if playerData == 0 or (HeroSelector.CategoryMultiMatchAll and filter == playerData) or (not HeroSelector.CategoryMultiMatchAll and filter > 0) then
                    BlzFrameSetAlpha(button, 255)
                else
                    BlzFrameSetAlpha(button, HeroSelector.CategoryFilteredAlpha)
                end
            end
        end
    end
end

function HeroSelector.getDisabledIcon(icon)
    --ReplaceableTextures\CommandButtons\BTNHeroPaladin.tga -> ReplaceableTextures\CommandButtonsDisabled\DISBTNHeroPaladin.tga
    if string.sub(icon,35,35) ~= "\\" then 
        if string.sub(icon, 1, 1) == "B" then
            return "ReplaceableTextures\\CommandButtonsDisabled\\DIS"..icon 
        end
        return icon
    end --this string has not enough chars return it
    --string.len(icon) < 35 then return icon end --this string has not enough chars return it
    local prefix = string.sub(icon, 1, 34)
    local sufix = string.sub(icon, 36)
    return prefix .."Disabled\\DIS"..sufix
end

function HeroSelector.updateTooltip(unitCode)
    local tooltipFrame = HeroSelector.HeroButtons[HeroSelector.UnitData[unitCode].Index].Tooltip 
    local unitData = HeroSelector.UnitData[unitCode]
    local hName = getHeroName(unitCode)
    if unitData.Count > HeroSelector.UnitCount then
        BlzFrameSetText(tooltipFrame, HeroSelector.TooltipPrefix..hName.."\n|r("..GetLocalizedString(HeroSelector.BanTooltip)..")")
    else
        if unitData.Count == HeroSelector.UnitCount or unitData.InTeam[GetPlayerTeam(GetLocalPlayer())] >= HeroSelector.UnitCountPerTeam then
            BlzFrameSetText(tooltipFrame, HeroSelector.TooltipPrefix..hName.."\n|r("..GetLocalizedString(HeroSelector.ToManyTooltip)..")")
        elseif not HeroSelector.buttonRequirementDone(unitCode, GetLocalPlayer()) then
            BlzFrameSetText(tooltipFrame, HeroSelector.TooltipPrefix..hName.."\n|r("..GetLocalizedString(HeroSelector.TooltipRequires)..")")
        else
            BlzFrameSetText(tooltipFrame, HeroSelector.TooltipPrefix..hName)
        end
    end
    -- if unitData.Count > HeroSelector.UnitCount then
    --     BlzFrameSetText(tooltipFrame, HeroSelector.TooltipPrefix..GetObjectName(unitCode).."\n|r("..GetLocalizedString(HeroSelector.BanTooltip)..")")
    -- else
    --     if unitData.Count == HeroSelector.UnitCount or unitData.InTeam[GetPlayerTeam(GetLocalPlayer())] >= HeroSelector.UnitCountPerTeam then
    --         BlzFrameSetText(tooltipFrame, HeroSelector.TooltipPrefix..GetObjectName(unitCode).."\n|r("..GetLocalizedString(HeroSelector.ToManyTooltip)..")")
    --     elseif not HeroSelector.buttonRequirementDone(unitCode, GetLocalPlayer()) then
    --         BlzFrameSetText(tooltipFrame, HeroSelector.TooltipPrefix..GetObjectName(unitCode).."\n|r("..GetLocalizedString(HeroSelector.TooltipRequires)..")")
    --     else
    --         BlzFrameSetText(tooltipFrame, HeroSelector.TooltipPrefix..GetObjectName(unitCode))
    --     end
    -- end
end

function HeroSelector.addCategory(icon, text)
    if HeroSelector.CategoryHighest then
        HeroSelector.CategoryHighest = HeroSelector.CategoryHighest*2
    else
        HeroSelector.CategoryHighest = 1
    end
    
    local newObject = {}
    table.insert(HeroSelector.Category, newObject)
    newObject.Value = HeroSelector.CategoryHighest
    newObject.Texture = icon
    newObject.TextureDisabled = HeroSelector.getDisabledIcon(icon)
    newObject.Text = text
    newObject.TextValue = text
    
    if HeroSelector.Box then
        local box = HeroSelector.Box
        local lastButton = HeroSelector.CategoryButton[#HeroSelector.CategoryButton]
        local button = BlzCreateFrame("HeroSelectorCategoryButton", box, 0, 0)
        local icon = BlzGetFrameByName("HeroSelectorCategoryButtonIcon", 0)
        local iconPushed = BlzGetFrameByName("HeroSelectorCategoryButtonIconPushed", 0)
        local tooltip = BlzCreateFrame("HeroSelectorText", box, 0, 0)
        BlzFrameSetText(tooltip, GetLocalizedString(text))
        newObject.Text = tooltip --when this is reached overwritte textframe with the tooltip
        BlzFrameSetTooltip(button, tooltip)
        BlzFrameSetPoint(tooltip, FRAMEPOINT_BOTTOM, button, FRAMEPOINT_TOP, 0, 0)
        BlzFrameSetSize(button, 0.02, 0.02)
        BlzFrameSetTexture(icon, newObject.TextureDisabled, 0, true)
        BlzFrameSetTexture(iconPushed, newObject.TextureDisabled, 0, true)
        HeroSelector.CategoryButton[button] = newObject
        TasButtonAction.Set(button, HeroSelector.CategoryClickAction)
        newObject.Icon = icon
        newObject.IconPushed = iconPushed
        newObject.Button = button

        if not lastButton then
            local titleSize = 0.015
            local borderSize = HeroSelector.BorderSize[GetPlayerRace(GetLocalPlayer())]
            local y = -borderSize - titleSize - 0.01
            local x = borderSize
            BlzFrameSetPoint(button, FRAMEPOINT_TOPLEFT, box, FRAMEPOINT_TOPLEFT, x, y)
        else
            BlzFrameSetPoint(button, FRAMEPOINT_LEFT, lastButton, FRAMEPOINT_RIGHT, 0, 0)
        end
        table.insert(HeroSelector.CategoryButton, button)
        table.insert(HeroSelector.Frames, tooltip)
        table.insert(HeroSelector.Frames, icon)
        table.insert(HeroSelector.Frames, button)
    end
end

function HeroSelector.addUnit(unitCode, onlyRandom, requirement)
    --no unitCode => empty field
    if not unitCode or unitCode == 0 then
        table.insert(HeroSelector.UnitData, 0)
    else
        --'Hpal' -> number?
        if type(unitCode) == "string" then
            unitCode = FourCC(unitCode)
        end

        --Such an object Exist?
        if GetObjectName(unitCode) == "" then print(('>I4'):pack(unitCode), "is not an valid Object") return end
        
        --only unique
        if HeroSelector.UnitData[unitCode] then return end
        HeroSelector.UnitDataPool[unitCode] = true -- add to random

        HeroSelector.UnitData[unitCode] = {Index = 0, Count = 0, InTeam = __jarray(0), Category = 0, Requirment = HeroSelector.convertReq(requirement), RequirmentData = requirement}
        HeroSelector.autoDetectCategory(unitCode)
        if not onlyRandom then
            table.insert(HeroSelector.UnitData, unitCode)
            HeroSelector.UnitData[unitCode].Index = #HeroSelector.UnitData   --remember the index for the unitCode
        end
      
        
    end

end

function HeroSelector.clearUnitData()
    HeroSelector.UnitDataPool = {}
    HeroSelector.UnitData = {}
    HeroSelector.BanDelayed = {}
    HeroSelector.update()
end

function HeroSelector.setFrameText(frame, text, who)
    if HeroSelector.includesPlayer(who, GetLocalPlayer()) then
        BlzFrameSetText(frame, text)
    end
end

function HeroSelector.setTitleText(text, who)
    HeroSelector.setFrameText(HeroSelector.Title, text, who)
end
function HeroSelector.setAcceptButtonText(text, who)
    HeroSelector.setFrameText(HeroSelector.AcceptButton, text, who)
end
function HeroSelector.setBanButtonText(text, who)
    HeroSelector.setFrameText(HeroSelector.BanButton, text, who)
end

function HeroSelector.isPlayerRace(unitCode, player)
    return HeroSelector.UnitData[unitCode].RequirmentData == GetPlayerRace(player) 
end
function HeroSelector.IsPlayerForce(unitCode, player)
    return BlzForceHasPlayer(HeroSelector.UnitData[unitCode].RequirmentData, player)
end
function HeroSelector.IsPlayerTeamNr(unitCode, player)
    return HeroSelector.UnitData[unitCode].RequirmentData == GetPlayerTeam(player)
end
function HeroSelector.isPlayer(unitCode, player)
    return HeroSelector.UnitData[unitCode].RequirmentData == player
end
function HeroSelector.HasPlayerTechLevel(unitCode, player)
    return GetPlayerTechCount(player, HeroSelector.UnitData[unitCode].RequirmentData[1], true) >= HeroSelector.UnitData[unitCode].RequirmentData[2]
end

function HeroSelector.convertReq(who)
    if not who then
        return nil
    elseif type(who) == "number" then
        return HeroSelector.IsPlayerTeamNr
    elseif type(who) == "table" then
        return HeroSelector.HasPlayerTechLevel
    elseif tostring(who):sub(1, 5) == "race:" then
        return HeroSelector.isPlayerRace
    elseif tostring(who):sub(1, 7) == "player:" then
        return HeroSelector.isPlayer
    elseif tostring(who):sub(1, 6) == "force:" then
        return HeroSelector.IsPlayerForce
    end
    return nil
end

function HeroSelector.setUnitReq(unitCode, who)
    if type(unitCode) == "string" then
        unitCode = FourCC(unitCode)
    end
    --Such an object Exist?
    if not HeroSelector.UnitData[unitCode] then return end

    HeroSelector.UnitData[unitCode].RequirmentData = who
    HeroSelector.UnitData[unitCode].Requirment = HeroSelector.convertReq(who)
end
function HeroSelector.setUnitCategory(unitCode, category)
    if type(unitCode) == "string" then
        unitCode = FourCC(unitCode)
    end
    --Such an object Exist?
    if not HeroSelector.UnitData[unitCode] then return end

    HeroSelector.UnitData[unitCode].Category = category
end
function HeroSelector.addUnitCategory(unitCode, category)
    if type(unitCode) == "string" then
        unitCode = FourCC(unitCode)
    end
    --Such an object Exist?
    if not HeroSelector.UnitData[unitCode] then return end

    HeroSelector.UnitData[unitCode].Category = BlzBitOr(category, HeroSelector.UnitData[unitCode].Category)
end

function HeroSelector.deselectButtons(buttonIndex)
    if buttonIndex and buttonIndex > 0 then
        if HeroSelector.HeroButtons[GetLocalPlayer()] == buttonIndex then
            BlzFrameSetVisible(HeroSelector.SelectedIndikator, false)
        end
        for index= 0, GetBJMaxPlayers() - 1,1 do
            if HeroSelector.HeroButtons[Player(index)] == buttonIndex then
                HeroSelector.HeroButtons[Player(index)] = 0 
            end
        end
    else
        for index= 0, GetBJMaxPlayers() - 1,1 do
            HeroSelector.HeroButtons[Player(index)] = 0 
        end
        BlzFrameSetVisible(HeroSelector.SelectedIndikator, false)
    end
end

function HeroSelector.buttonRequirementDone(unitCode, player)
    --true when no requirement is set or the requirment call is successful
    return not HeroSelector.UnitData[unitCode].Requirment or HeroSelector.UnitData[unitCode].Requirment(unitCode, player)
end

function HeroSelector.disableButtonIndex(buttonIndex, teamNr)
    if buttonIndex > 0 then
        if HeroSelector.includesPlayer(teamNr, GetLocalPlayer()) then
            BlzFrameSetEnable(HeroSelector.HeroButtons[buttonIndex].Frame, false)
        end
        if HeroSelector.HeroButtons[GetLocalPlayer()] == buttonIndex then
            BlzFrameSetVisible(HeroSelector.SelectedIndikator, false)
        end

        --deselect this Button from all players or the team
        for index= 0, GetBJMaxPlayers() - 1,1 do
            local player = Player(index)
            if (not teamNr or teamNr == GetPlayerTeam(player)) and HeroSelector.HeroButtons[player] == buttonIndex then
                HeroSelector.HeroButtons[player] = 0                
            end
        end
    end
end

function HeroSelector.enableButtonIndex(unitCode, buttonIndex, teamNr)
    if buttonIndex > 0 and (not teamNr or teamNr == GetPlayerTeam(GetLocalPlayer())) then
        BlzFrameSetEnable(HeroSelector.HeroButtons[buttonIndex].Frame, true and (HeroSelector.BanIgnoreRequirment and BlzFrameIsVisible(HeroSelector.BanButton)) or HeroSelector.buttonRequirementDone(unitCode, GetLocalPlayer()))
    end
end

function HeroSelector.counterChangeUnitCode(unitCode, add, player)
    if not HeroSelector.UnitData[unitCode] then HeroSelector.UnitData[unitCode] = {Count = 0, InTeam = __jarray(0)} end
    local buttonIndex = HeroSelector.UnitData[unitCode].Index
    if not buttonIndex  then buttonIndex = 0 end

    local teamNr = GetPlayerTeam(player)
    
    HeroSelector.UnitData[unitCode].InTeam[teamNr] = HeroSelector.UnitData[unitCode].InTeam[teamNr] + add
    HeroSelector.UnitData[unitCode].Count = HeroSelector.UnitData[unitCode].Count + add

    if HeroSelector.UnitData[unitCode].Count >= HeroSelector.UnitCount then
        --disable for all
        HeroSelector.disableButtonIndex(buttonIndex)
    else
        --enable for all
        HeroSelector.enableButtonIndex(unitCode, buttonIndex)
        if HeroSelector.UnitData[unitCode].InTeam[teamNr] >= HeroSelector.UnitCountPerTeam  then
            --disable for this team
            HeroSelector.disableButtonIndex(buttonIndex, teamNr)
        end
    end
    HeroSelector.updateTooltip(unitCode)
end

function HeroSelector.counterSetUnitCode(unitCode, set, player)
    if not HeroSelector.UnitData[unitCode] then HeroSelector.UnitData[unitCode] = {Count = 0, InTeam = __jarray(0)} end
    local buttonIndex = HeroSelector.UnitData[unitCode].Index
    if not buttonIndex  then buttonIndex = 0 end

    local teamNr = GetPlayerTeam(player)
    
    HeroSelector.UnitData[unitCode].InTeam[teamNr] = set
    HeroSelector.UnitData[unitCode].Count = set

    if HeroSelector.UnitData[unitCode].Count >= HeroSelector.UnitCount then
        --disable for all
        HeroSelector.disableButtonIndex(buttonIndex)
    else
        --enable for all
        HeroSelector.enableButtonIndex(unitCode, buttonIndex)
        if HeroSelector.UnitData[unitCode].InTeam[teamNr] >= HeroSelector.UnitCountPerTeam  then
            --disable for this team
            HeroSelector.disableButtonIndex(buttonIndex, teamNr)
        end
    end
    HeroSelector.updateTooltip(unitCode)
end

HeroSelector.rollOptionData = {Count = 0}

function HeroSelector.rollOption(player, includeRandomOnly, excludedIndex, category)
    if not excludedIndex then excludedIndex = 0 end
    if not category then category = 0 end
    local teamNr = GetPlayerTeam(player)
    HeroSelector.rollOptionData.Count = 0
    for unitCode, value in pairs(HeroSelector.UnitDataPool)
    do
        
        local allowed = value
        --total limited reached?
        if HeroSelector.UnitData[unitCode].Count >= HeroSelector.UnitCount then
            allowed = false
            --print(GetObjectName(unitCode))
            --print("rejected total limit")
        end
        --team limited reached?
        if allowed and HeroSelector.UnitData[unitCode].InTeam[teamNr] >= HeroSelector.UnitCountPerTeam  then
            --print(GetObjectName(unitCode))
            --print("rejected team limit")
            allowed = false
        end
        --allow randomOnly?
        if allowed and not includeRandomOnly and HeroSelector.UnitData[unitCode].Index == 0  then
            --print(GetObjectName(unitCode))
            --print("rejected random only")
            allowed = false
        end
        --this index is excluded? This can make sure you get another button.
        if allowed and HeroSelector.UnitData[unitCode].Index > 0 and HeroSelector.UnitData[unitCode].Index == excludedIndex then
            --print(GetObjectName(unitCode))
            --print("rejected exclude")
            allowed = false
        end
        --fullfills the requirement?
        if allowed and not HeroSelector.buttonRequirementDone(unitCode, player) then
            --print(GetObjectName(unitCode))
            --print("rejected requirement")
            allowed = false
        end
        local filter = BlzBitAnd(category, HeroSelector.UnitData[unitCode].Category)
        if allowed and category and category > 0 and ((HeroSelector.CategoryMultiMatchAll and filter ~= category) or (not HeroSelector.CategoryMultiMatchAll and filter == 0)) then
        --when having an given an category only allow options having that category atleast partly
        -- if allowed and category and category > 0 and BlzBitAnd(category, HeroSelector.UnitData[unitCode].Category) == 0 then
            --print(GetObjectName(unitCode))
            --print("  rejected category", category, HeroSelector.UnitData[unitCode].Category)
            allowed = false
        end

        if allowed then
            HeroSelector.rollOptionData.Count = HeroSelector.rollOptionData.Count + 1
            HeroSelector.rollOptionData[HeroSelector.rollOptionData.Count] = unitCode
        end
    end
    --nothing is allwoed?
    if HeroSelector.rollOptionData.Count == 0 then return nil end

    return HeroSelector.rollOptionData[GetRandomInt(1, HeroSelector.rollOptionData.Count)]
end

function HeroSelector.doRandom(player)
    local category = 0
    if HeroSelector.CategoryAffectRandom then category = HeroSelector.Category[player] end
    local unitCode = HeroSelector.rollOption(player, true, 0, category)
    if not unitCode then return end

    HeroSelector.counterChangeUnitCode(unitCode, 1, player)
    HeroSelector.unitCreated(player, unitCode, true)
end

function HeroSelector.doPick(player)
    --pick what currently is selected, returns true on success returns false when something went wrong,
    if not HeroSelector.HeroButtons[player] then return false end
    local buttonIndex = HeroSelector.HeroButtons[player]
    if buttonIndex <= 0 then return false end --reject nothing selected
    local unitCode = HeroSelector.UnitData[buttonIndex]
    if not HeroSelector.buttonRequirementDone(unitCode, player) then return false end --requirment fullfilled

    HeroSelector.counterChangeUnitCode(unitCode, 1, player)
    HeroSelector.unitCreated(player, unitCode)
    return true
end

function HeroSelector.forceRandom(who)
    --this is a wrapper for doRandom allowing different dataTypes
    if not who then
        for index= 0, GetBJMaxPlayers() - 1,1 do
            local player = Player(index)
            if GetPlayerSlotState(player) == PLAYER_SLOT_STATE_PLAYING then
                HeroSelector.doRandom(Player(index)) 
            end
        end
    elseif type(who) == "number" then
        for index= 0, GetBJMaxPlayers() - 1,1 do
            local player = Player(index)
            if GetPlayerSlotState(player) == PLAYER_SLOT_STATE_PLAYING then
                if GetPlayerTeam(player) == who then
                    HeroSelector.doRandom(player)
                end
            end
        end
    elseif tostring(who):sub(1, 5) == "race:" then
        for index= 0, GetBJMaxPlayers() - 1,1 do
            local player = Player(index)
            if GetPlayerSlotState(player) == PLAYER_SLOT_STATE_PLAYING then
                if GetPlayerRace(player) == who then
                    HeroSelector.doRandom(player) 
                end
            end
        end
    elseif tostring(who):sub(1, 7) == "player:" then
        HeroSelector.doRandom(who)
    elseif tostring(who):sub(1, 6) == "force:"then
        ForForce(who, function() HeroSelector.doRandom(GetEnumPlayer()) end)
    end
end

function HeroSelector.forcePick(who)
    if not who then
        for index= 0, GetBJMaxPlayers() - 1,1 do
            local player = Player(index)
            if GetPlayerSlotState(player) == PLAYER_SLOT_STATE_PLAYING then
                if not HeroSelector.doPick(player) then --do picking, when that fails doRandom
                    HeroSelector.doRandom(player)
                end
            end
        end
    elseif type(who) == "number" then
        for index= 0, GetBJMaxPlayers() - 1,1 do
            local player = Player(index)
            if GetPlayerSlotState(player) == PLAYER_SLOT_STATE_PLAYING then
                if GetPlayerTeam(player) == who then
                    if not HeroSelector.doPick(player) then
                        HeroSelector.doRandom(player) 
                    end
                end
            end
        end
    elseif tostring(who):sub(1, 5) == "race:" then
        for index= 0, GetBJMaxPlayers() - 1,1 do
            local player = Player(index)
            if GetPlayerSlotState(player) == PLAYER_SLOT_STATE_PLAYING then
                if GetPlayerRace(player) == who then
                    if not HeroSelector.doPick(player) then
                        HeroSelector.doRandom(player) 
                    end
                end
            end
        end
    elseif tostring(who):sub(1, 7) == "player:" then
        if not HeroSelector.doPick(who) then
            HeroSelector.doRandom(who) 
        end
    elseif tostring(who):sub(1, 6) == "force:" then
        ForForce(who, function()
            local player = GetEnumPlayer()
            if not HeroSelector.doPick(player) then
                HeroSelector.doRandom(player) 
            end 
        end)
    end
end

function HeroSelector.includesPlayer(who, player)
    if not who then --there is no who -> everyone
        return true
    elseif type(who) == "number" and GetPlayerTeam(player) == who then
        return true
    elseif tostring(who):sub(1, 5) == "race:" and GetPlayerRace(player) == who  then
        return true
    elseif tostring(who):sub(1, 7) == "player:" and player == who then
        return true
    elseif tostring(who):sub(1, 6) == "force:" and BlzForceHasPlayer(who, player) then
        return true
    end
    return false
end

function HeroSelector.enablePick(flag, who)
    for index = #HeroSelector.BanDelayed, 1, -1
    do
        local ban = table.remove(HeroSelector.BanDelayed)
        HeroSelector.counterChangeUnitCode(ban[1], HeroSelector.UnitCount + 1, ban[2])
    end

    if HeroSelector.includesPlayer(who, GetLocalPlayer()) then
        HeroSelector.LastAction = "enablePick"
        HeroSelector.LastActionArg = flag
        BlzFrameSetVisible(HeroSelector.AcceptButton, true and HeroSelector.AcceptButtonIsShown)
        BlzFrameSetVisible(HeroSelector.RandomButton, true and HeroSelector.RandomButtonIsShown)
        BlzFrameSetVisible(HeroSelector.BanButton, false)
        BlzFrameSetEnable(HeroSelector.AcceptButton, flag)
        BlzFrameSetEnable(HeroSelector.RandomButton, flag)
        BlzFrameSetModel(HeroSelector.SelectedIndikator, HeroSelector.IndicatorPathPick, 0)
        if HeroSelector.BanIgnoreRequirment then HeroSelector.update() end
    end
    
end

function HeroSelector.enableBan(flag, who)  
    if HeroSelector.includesPlayer(who, GetLocalPlayer()) then
        HeroSelector.LastAction = "enableBan"
        HeroSelector.LastActionArg = flag
        BlzFrameSetVisible(HeroSelector.AcceptButton, false)
        BlzFrameSetVisible(HeroSelector.RandomButton, false)
        BlzFrameSetVisible(HeroSelector.BanButton, true)
        BlzFrameSetEnable(HeroSelector.BanButton, flag)
        BlzFrameSetModel(HeroSelector.SelectedIndikator, HeroSelector.IndicatorPathBan, 0)
        if HeroSelector.BanIgnoreRequirment then HeroSelector.update() end
    end    
end

function HeroSelector.destroy()
    for key, value in ipairs(HeroSelector.Frames)
    do
        BlzDestroyFrame(value)
    end
    HeroSelector.Frames = nil
    for key, value in ipairs(HeroSelector.HeroButtons)
    do
        BlzDestroyFrame(value.Tooltip)
        BlzDestroyFrame(value.Icon)
        BlzDestroyFrame(value.IconDisabled)
        BlzDestroyFrame(value.Frame)
    end
    HeroSelector.HeroButtons = nil

    BlzDestroyFrame(HeroSelector.SelectedIndikator)
    
    HeroSelector.UnitData = nil
    HeroSelector.BorderSize = nil
    HeroSelector = nil
    
end

function HeroSelector.frameLoseFocus(frame)
    if BlzFrameGetEnable(frame) then
        BlzFrameSetEnable(frame, false)
        BlzFrameSetEnable(frame, true)
    end
end

function HeroSelector.actionPressHeroButton()
    local button = BlzGetTriggerFrame()
    local player = GetTriggerPlayer()
    local buttonIndex = HeroSelector.HeroButtons[button]
    local unitCode = HeroSelector.UnitData[buttonIndex]
    HeroSelector.HeroButtons[player] = buttonIndex
    if GetLocalPlayer() == player then
        HeroSelector.frameLoseFocus(BlzGetTriggerFrame())
    end
    if GetLocalPlayer() == player then
        BlzFrameSetVisible(HeroSelector.SelectedIndikator, true)
        
        BlzFrameSetPoint(HeroSelector.SelectedIndikator, FRAMEPOINT_TOPLEFT, button, FRAMEPOINT_TOPLEFT, -0.001, 0.001)
        BlzFrameSetPoint(HeroSelector.SelectedIndikator, FRAMEPOINT_BOTTOMRIGHT, button, FRAMEPOINT_BOTTOMRIGHT, -0.0012, -0.0016)
    end
    HeroSelector.buttonSelected(player, unitCode)
end

function HeroSelector.actionRandomButton()
    local player = GetTriggerPlayer()
    HeroSelector.frameLoseFocus(BlzGetTriggerFrame())
    if HeroSelector.RandomButtonPick then
        HeroSelector.doRandom(player)
    else
        local unitCode = HeroSelector.rollOption(player, false, HeroSelector.HeroButtons[player], HeroSelector.Category[player])
        if unitCode and GetLocalPlayer() == player then
            local buttonIndex = HeroSelector.UnitData[unitCode].Index
            BlzFrameClick(HeroSelector.HeroButtons[buttonIndex].Frame)
        end
    end
end

function HeroSelector.actionAcceptButton()
    HeroSelector.frameLoseFocus(BlzGetTriggerFrame())
    HeroSelector.doPick(GetTriggerPlayer())
end

function HeroSelector.actionBanButton()
    local player = GetTriggerPlayer()
    HeroSelector.frameLoseFocus(BlzGetTriggerFrame())
    if not HeroSelector.HeroButtons[player] then return end
    local buttonIndex = HeroSelector.HeroButtons[player]
    if buttonIndex <= 0 then return end --reject nothing selected
    local unitCode = HeroSelector.UnitData[buttonIndex]
    if not HeroSelector.DelayBanUntilPick then
        HeroSelector.counterChangeUnitCode(unitCode, HeroSelector.UnitCount + 1, player)
    else
        table.insert(HeroSelector.BanDelayed, {unitCode, player})
    end
    HeroSelector.unitBaned(player, unitCode)
end

function HeroSelector.update()
    for buttonIndex, value in ipairs(HeroSelector.HeroButtons)
    do
        --have data for this button?
        
        if HeroSelector.UnitData[buttonIndex] and HeroSelector.UnitData[buttonIndex] > 0 then
            if HeroSelector.HideEmptyButtons then BlzFrameSetVisible(value.Frame, true) end
            local unitCode = HeroSelector.UnitData[buttonIndex]
            if HeroSelector.UnitData[unitCode].Count >= HeroSelector.UnitCount then
                --disable for all
                HeroSelector.disableButtonIndex(buttonIndex)
            else
                --enable for all
                HeroSelector.enableButtonIndex(unitCode, buttonIndex)
                for teamNr, inTeamCount in pairs(HeroSelector.UnitData[unitCode].InTeam) do
                    if HeroSelector.UnitData[unitCode].InTeam[teamNr] >= HeroSelector.UnitCountPerTeam  then
                        --disable for this team
                        HeroSelector.disableButtonIndex(buttonIndex, teamNr)
                    end
                end
            end
            BlzFrameSetTexture(value.Icon, BlzGetAbilityIcon(unitCode), 0, HeroSelector.ButtonBlendAll)
            BlzFrameSetTexture(value.IconPushed, BlzGetAbilityIcon(unitCode), 0, HeroSelector.ButtonBlendAll)
            BlzFrameSetTexture(value.IconDisabled, HeroSelector.getDisabledIcon(BlzGetAbilityIcon(unitCode)), 0, HeroSelector.ButtonBlendAll)
            --BlzFrameSetText(value.Tooltip, HeroSelector.TooltipPrefix..GetObjectName(unitCode))
            HeroSelector.updateTooltip(unitCode)
            
        else
            --no, make it unclickable and empty
            if HeroSelector.HideEmptyButtons then BlzFrameSetVisible(value.Frame, false) end
            BlzFrameSetEnable(value.Frame, false)
            BlzFrameSetTexture(value.Icon, HeroSelector.EmptyButtonPath, 0, true)
            BlzFrameSetTexture(value.IconPushed, HeroSelector.EmptyButtonPath, 0, true)
            BlzFrameSetTexture(value.IconDisabled, HeroSelector.EmptyButtonPath, 0, true)
        end
    end
end

function HeroSelector.showFrame(frame, flag, who)
    if HeroSelector.includesPlayer(who, GetLocalPlayer()) then
        BlzFrameSetVisible(frame, flag)
    end
end

function HeroSelector.show(flag, who)
    HeroSelector.showFrame(HeroSelector.Box, flag, who)
    if HeroSelector.includesPlayer(who, GetLocalPlayer()) then
        BlzHideOriginFrames(flag)
    end
end

do
local function InitFrames()
    BlzLoadTOCFile("CustomUI\\Templates.toc") --ex/import also "HeroSelector.fdf"
    HeroSelector.HeroButtons  = {} --the clickable Buttons

    HeroSelector.CategoryButton = {}

    HeroSelector.Frames = {}


    local titleSize = 0.015
    local buttonSize = HeroSelector.ButtonSize
    local borderSize = HeroSelector.BorderSize[GetPlayerRace(GetLocalPlayer())]
    local colCount = HeroSelector.ButtonColCount
    local rowCount = HeroSelector.ButtonRowCount
    local box = BlzCreateFrame(HeroSelector.BoxFrameName, BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), 0, 0)
    --local boxTitle = BlzCreateFrame(HeroSelector.BoxFrameName, box, 0, 0)
    local boxBottom = BlzCreateFrame("HeroSelectorRaceTopBox", box, 0, 0)
    local titel = BlzCreateFrame("HeroSelectorTitle", box, 0, 0)
    
    HeroSelector.Title = titel
    local indicatorParent = BlzCreateFrameByType("BUTTON", "MyHeroIndikatorParent", box, "", 0)
    HeroSelector.SelectedIndikator = BlzCreateFrameByType("SPRITE", "MyHeroIndikator", indicatorParent, "", 0)
    BlzFrameSetLevel(indicatorParent, 9)

    BlzFrameSetModel(HeroSelector.SelectedIndikator, HeroSelector.IndicatorPathPick, 0)
    BlzFrameSetScale(HeroSelector.SelectedIndikator, buttonSize/0.036) --scale the model to the button size.
    

    --BlzFrameSetPoint(boxTitle, FRAMEPOINT_TOPLEFT, box, FRAMEPOINT_TOPLEFT, 0, -(titleSize - 0.003 + 0.9*borderSize))
    --BlzFrameSetPoint(boxTitle, FRAMEPOINT_BOTTOMRIGHT, box, FRAMEPOINT_TOPRIGHT, 0, - 0.9*borderSize - titleSize - 0.003 -HeroSelector.CategorySize)
    --BlzFrameSetSize(boxTitle, 0.01, 0.1)
    -- human UI size differs much, needs other numbers
    if GetPlayerRace(GetLocalPlayer()) == RACE_HUMAN then
        BlzFrameSetPoint(boxBottom, FRAMEPOINT_TOPLEFT, box, FRAMEPOINT_TOPLEFT, borderSize*0.055, - 0.9*borderSize - titleSize - 0.003 -HeroSelector.CategorySize)
        BlzFrameSetPoint(boxBottom, FRAMEPOINT_TOPRIGHT, box, FRAMEPOINT_TOPRIGHT, -borderSize*0.055, - 0.9*borderSize - titleSize - 0.003 -HeroSelector.CategorySize)
    else
        BlzFrameSetPoint(boxBottom, FRAMEPOINT_TOPLEFT, box, FRAMEPOINT_TOPLEFT, borderSize*0.25, - 0.9*borderSize - titleSize - 0.003 -HeroSelector.CategorySize)
        BlzFrameSetPoint(boxBottom, FRAMEPOINT_TOPRIGHT, box, FRAMEPOINT_TOPRIGHT, -borderSize*0.25, - 0.9*borderSize - titleSize - 0.003 -HeroSelector.CategorySize)
    end
    BlzFrameSetSize(boxBottom, 0.01, 0.1)
    
    
    BlzFrameSetVisible(HeroSelector.SelectedIndikator, false)
    BlzFrameSetAbsPoint(box, HeroSelector.BoxPosPoint, HeroSelector.BoxPosX, HeroSelector.BoxPosY)   
    BlzFrameSetSize(box, borderSize*2 + buttonSize*colCount + HeroSelector.SpaceBetweenX*(colCount-1), borderSize*2 + buttonSize*rowCount + HeroSelector.SpaceBetweenY*(rowCount - 1) + titleSize + HeroSelector.CategorySize + 0.0145)
    BlzFrameSetTextAlignment(titel, TEXT_JUSTIFY_MIDDLE, TEXT_JUSTIFY_CENTER)
    BlzFrameSetPoint(titel, FRAMEPOINT_TOP, box, FRAMEPOINT_TOP, 0, -borderSize*0.6)
    BlzFrameSetSize(titel, BlzFrameGetWidth(box) - borderSize*2, 0.03)
    
    BlzFrameSetText(titel, "Hero Selection")

    local rowRemaining = colCount
    if colCount*rowCount < #HeroSelector.UnitData then
        print("FieldCount:",colCount*rowCount, "HeroCount",#HeroSelector.UnitData)
    end
    local y = -borderSize - titleSize - 0.0125 - HeroSelector.CategorySize
    local x = borderSize
    for buttonIndex = 1, colCount*rowCount, 1 do
        local button = BlzCreateFrame("HeroSelectorButton", box, 0, buttonIndex)
        local icon = BlzGetFrameByName("HeroSelectorButtonIcon", buttonIndex)
        local iconPushed = BlzGetFrameByName("HeroSelectorButtonIconPushed", buttonIndex)
        local iconDisabled = BlzGetFrameByName("HeroSelectorButtonIconDisabled", buttonIndex)
        local tooltipBox = BlzCreateFrame("HeroSelectorTextBox", box, 0, buttonIndex)
        local tooltip = BlzCreateFrame("HeroSelectorText", tooltipBox, 0, buttonIndex)
        BlzFrameSetTooltip(button, tooltipBox)
        if not HeroSelector.TooltipRelativIsBox then
            BlzFrameSetPoint(tooltip, HeroSelector.TooltipPoint, button, HeroSelector.TooltipRelativePoint, HeroSelector.TooltipOffsetX ,HeroSelector.TooltipOffsetY)
        else
            BlzFrameSetPoint(tooltip, HeroSelector.TooltipPoint, box, HeroSelector.TooltipRelativePoint, HeroSelector.TooltipOffsetX ,HeroSelector.TooltipOffsetY)
        end
        BlzFrameSetPoint(tooltipBox, FRAMEPOINT_BOTTOMLEFT, tooltip, FRAMEPOINT_BOTTOMLEFT, -0.007, -0.007)
        BlzFrameSetPoint(tooltipBox, FRAMEPOINT_TOPRIGHT, tooltip, FRAMEPOINT_TOPRIGHT, 0.007, 0.007)
        TasButtonAction.Set(button, HeroSelector.actionPressHeroButton)
        BlzFrameSetSize(button, buttonSize, buttonSize)
 
        local heroButton = {}
        HeroSelector.HeroButtons[buttonIndex] = heroButton
        heroButton.Frame = button
        heroButton.Icon = icon
        heroButton.IconPushed = iconPushed
        heroButton.IconDisabled = iconDisabled
        heroButton.Tooltip = tooltip

        HeroSelector.HeroButtons[button] = buttonIndex
        if HeroSelector.ChainedButtons then --buttons are connected to the previous one or the previous row
            if buttonIndex == 1 then
                BlzFrameSetPoint(button, FRAMEPOINT_TOPLEFT, box, FRAMEPOINT_TOPLEFT, borderSize, y)
            elseif rowRemaining <= 0 then
                BlzFrameSetPoint(button, FRAMEPOINT_TOPLEFT, HeroSelector.HeroButtons[buttonIndex - colCount].Frame, FRAMEPOINT_BOTTOMLEFT, 0, -HeroSelector.SpaceBetweenY)
                rowRemaining = colCount
            else
                BlzFrameSetPoint(button, FRAMEPOINT_LEFT, HeroSelector.HeroButtons[buttonIndex - 1].Frame, FRAMEPOINT_RIGHT, HeroSelector.SpaceBetweenX, 0)
            end
        else --buttons have an offset to the TopLeft of the box
            if rowRemaining <= 0 then
                x = borderSize
                rowRemaining = colCount
                y = y - HeroSelector.SpaceBetweenY - buttonSize
            elseif buttonIndex ~= 1 then
                x = x + buttonSize + HeroSelector.SpaceBetweenX
            end
            BlzFrameSetPoint(button, FRAMEPOINT_TOPLEFT, box, FRAMEPOINT_TOPLEFT, x, y)
        end
        rowRemaining = rowRemaining - 1
    end
    local y = -0.9*borderSize - titleSize - 0.0025
    local x = borderSize*0.65
    --create category buttons added before the box was created
  
    for buttonIndex, value in ipairs(HeroSelector.Category)
    do

        local button = BlzCreateFrame("HeroSelectorCategoryButton", box, 0, 0)
        local icon = BlzGetFrameByName("HeroSelectorCategoryButtonIcon", 0)
        local iconPushed = BlzGetFrameByName("HeroSelectorCategoryButtonIconPushed", 0)
        local tooltipBox = BlzCreateFrame("HeroSelectorTextBox", box, 0, buttonIndex)
        local tooltip = BlzCreateFrame("HeroSelectorText", tooltipBox, 0, buttonIndex)

        BlzFrameSetPoint(tooltipBox, FRAMEPOINT_BOTTOMLEFT, tooltip, FRAMEPOINT_BOTTOMLEFT, -0.007, -0.007)
        BlzFrameSetPoint(tooltipBox, FRAMEPOINT_TOPRIGHT, tooltip, FRAMEPOINT_TOPRIGHT, 0.007, 0.007)
        
        BlzFrameSetText(tooltip, GetLocalizedString(value.TextValue))
        
        value.Text = tooltip
        BlzFrameSetPoint(tooltip, FRAMEPOINT_BOTTOM, button, FRAMEPOINT_TOP, 0, 0.007)
        BlzFrameSetTooltip(button, tooltipBox)
        BlzFrameSetSize(button, HeroSelector.CategorySize, HeroSelector.CategorySize)
        BlzFrameSetTexture(icon, value.TextureDisabled, 0, true)
        BlzFrameSetTexture(iconPushed, value.TextureDisabled, 0, true)
        HeroSelector.CategoryButton[button] = value
        TasButtonAction.Set(button, HeroSelector.CategoryClickAction)
        value.Icon = icon
        value.IconPushed = iconPushed
        value.Button = button

        local lastButton = HeroSelector.CategoryButton[buttonIndex - 1]
        if not lastButton then
            BlzFrameSetPoint(button, FRAMEPOINT_TOPLEFT, box, FRAMEPOINT_TOPLEFT, x, y)
        else
            BlzFrameSetPoint(button, FRAMEPOINT_LEFT, lastButton, FRAMEPOINT_RIGHT, HeroSelector.CategorySpaceX, 0)
        end
        table.insert(HeroSelector.CategoryButton, button)
        table.insert(HeroSelector.Frames, tooltip)
        table.insert(HeroSelector.Frames, icon)
        table.insert(HeroSelector.Frames, button)
    end

    local acceptButton = BlzCreateFrame("HeroSelectorTextButton", box, 0, 0)
    local randomButton = BlzCreateFrame("HeroSelectorTextButton", box, 0, 1)
    local banButton = BlzCreateFrame("HeroSelectorTextButton", box, 0, 2)

    TasButtonAction.Set(acceptButton, HeroSelector.actionAcceptButton)
    TasButtonAction.Set(randomButton, HeroSelector.actionRandomButton)
    TasButtonAction.Set(banButton, HeroSelector.actionBanButton)
    BlzFrameSetSize(acceptButton, HeroSelector.AcceptButtonSizeX, HeroSelector.AcceptButtonSizeY)
    BlzFrameSetSize(randomButton, HeroSelector.RandomButtonSizeX, HeroSelector.RandomButtonSizeY)
    BlzFrameSetSize(banButton, HeroSelector.BanButtonSizeX, HeroSelector.BanButtonSizeY)

    --OK, READY, ACCEPT
    BlzFrameSetText(acceptButton, HeroSelector.AcceptButtonTextPrefix .. GetLocalizedString(HeroSelector.AcceptButtonText))
    BlzFrameSetText(randomButton, HeroSelector.RandomButtonTextPrefix .. GetLocalizedString(HeroSelector.RandomButtonText))
    BlzFrameSetText(banButton, HeroSelector.BanButtonTextPrefix .. GetLocalizedString(HeroSelector.BanButtonText))
    BlzFrameSetPoint(acceptButton, HeroSelector.AcceptButtonAnchor, box, FRAMEPOINT_BOTTOM, 0, 0)
    BlzFrameSetPoint(randomButton, HeroSelector.RandomButtonAnchor, box, FRAMEPOINT_BOTTOM, 0, 0)
    BlzFrameSetPoint(banButton, FRAMEPOINT_BOTTOM, box, FRAMEPOINT_BOTTOM, 0, 0)
    HeroSelector.AcceptButton = acceptButton
    HeroSelector.RandomButton = randomButton
    HeroSelector.BanButton = banButton
    BlzFrameSetVisible(banButton, false)
    BlzFrameSetVisible(acceptButton, HeroSelector.AcceptButtonIsShown)
    BlzFrameSetVisible(randomButton, HeroSelector.RandomButtonIsShown)
    table.insert(HeroSelector.Frames, randomButton)
    table.insert(HeroSelector.Frames, acceptButton)
    table.insert(HeroSelector.Frames, titel)
    table.insert(HeroSelector.Frames, box)
    table.insert(HeroSelector.Frames, banButton)
    table.insert(HeroSelector.Frames, indicatorParent)
    
    HeroSelector.Box = box
    if not HeroSelector.AutoShow then
        BlzFrameSetVisible(box, false)
    end
    HeroSelector.update()
    
    
    if TeamViewer then TeamViewer.Init() end
    if HeroInfo then HeroInfo.Init() end
    
    if HeroSelector.LastAction then
        HeroSelector[HeroSelector.LastAction](HeroSelector.LastActionArg, GetLocalPlayer()) 
    end
end
    local backUp = MarkGameStarted
    function MarkGameStarted()
        backUp()
        
        if HeroSelector.initHeroes then HeroSelector.initHeroes() end
        InitFrames()
        if FrameLoaderAdd then FrameLoaderAdd(InitFrames) end    
    end 
end