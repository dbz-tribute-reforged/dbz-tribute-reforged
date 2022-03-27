--HeroInfo 1.2c
--Plugin for HeroInfo by Tasyen
--This Creates a TextArea which displays the name, the Extended tooltip of selected units and can show some of their skills.

HeroInfo = {}
-- TextArea
HeroInfo.DescHeroNamePrefix     = "|cffffcc00"   --added before the Units Name
HeroInfo.DescHeroNameSufix      = "|r"           --added after the units Name
HeroInfo.TextAreaSizeX          = 0.4
HeroInfo.TextAreaSizeY          = 0.2
HeroInfo.TextAreaOffsetX        = 0.05
HeroInfo.TextAreaOffsetY        = 0
HeroInfo.TextAreaPoint          = FRAMEPOINT_TOPLEFT --pos the Tooltip with which Point
HeroInfo.TextAreaRelativePoint  = FRAMEPOINT_BOTTOMLEFT --pos the Tooltip to which Point of the Relative
HeroInfo.TextAreaRelativeGame   = false --(false) relativ to box, (true) relativ to GameUI
HeroInfo.BackupSelected         = HeroSelector.buttonSelected
HeroInfo.BackupDestroy          = HeroSelector.destroy
-- Skill Priview
HeroInfo.MaxButtonCount         = 7 -- max amount of preview skills
HeroInfo.ButtonPerRow           = 7
HeroInfo.DetectUnitSkills       = false -- (true) creates a dummy (for neutral Passive) when selecting an option to find any skill this unitCode has on default and displays them in the preview
HeroInfo.ButtonSizeX            = 0.03
HeroInfo.ButtonSizeY            = 0.03
HeroInfo.ToolTipSize            = 0.2 -- how big is one line in the tooltip
HeroInfo.ToolTipFixedPos        = true -- (true) All tooltip's starts over the first Button

-- feed HeroInfo with skills units will preview.
HeroInfo.HeroData = {
    -- unitCode = "skillA,Skillb,SkillC..."
    -- get skill list from object editor:  hold shift then open the hero/unit skill field now copy paste the content
    Hpal = "AHhb,AHds,AHre,AHad"
    ,Hamg = "AHbz,AHab,AHwe,AHmt"
    ,Hmkg = "AHtc,AHtb,AHbh,AHav"
    ,Hblm = "AHfs,AHbn,AHdr,AHpx"
    ,Obla = "AOwk,AOcr,AOmi,AOww"
    ,Ofar = "AOfs,AOsf,AOcl,AOeq"
    ,Otch = "AOsh,AOae,AOre,AOws"
    ,Oshd = "AOhw,AOhx,AOsw,AOvd"
    ,Udea = "AUdc,AUdp,AUau,AUan"
    ,Ulic = "AUfn,AUfu,AUdr,AUdd"
    ,Udre = "AUav,AUsl,AUcs,AUin"
    ,Ucrl = "AUim,AUts,AUcb,AUls"
    ,Ekee = "AEer,AEfn,AEah,AEtq"
    ,Emoo = "AHfa,AEst,AEar,AEsf"
    ,Edem = "AEmb,AEim,AEev,AEme"
    ,Ewar = "AEbl,AEfk,AEsh,AEsv"
}

HeroInfo.Buttons = {}
HeroInfo.ButtonCurrentIndex = 0
-- taken from Prometheus3375
-- converts an objectId into it's string equl x -> "hfoo"
function GetFourCC(num)
    return string.pack(">I4", num)
end

function HeroSelector.destroy()
    BlzDestroyFrame(HeroInfo.TextArea)
    for index = 1, HeroInfo.MaxButtonCount do
        BlzDestroyFrame(HeroInfo.Buttons[index].Tooltip)
        BlzDestroyFrame(HeroInfo.Buttons[index].Icon)
        BlzDestroyFrame(HeroInfo.Buttons[index].IconPushed)
        BlzDestroyFrame(HeroInfo.Buttons[index].IconOff)
        BlzDestroyFrame(HeroInfo.Buttons[index].TooltipBox)
        BlzDestroyFrame(HeroInfo.Buttons[index].Button)        
    end
    HeroInfo.BackupDestroy()
    HeroInfo = nil
end

function HeroInfo.Init()
    
    HeroInfo.TextArea = BlzCreateFrame("HeroSelectorTextArea", HeroSelector.Box, 0, 0)    
    BlzFrameSetSize(HeroInfo.TextArea , HeroInfo.TextAreaSizeX, HeroInfo.TextAreaSizeY)
    if not HeroInfo.TextAreaRelativeGame then
        BlzFrameSetPoint(HeroInfo.TextArea, HeroInfo.TextAreaPoint, HeroSelector.Box, HeroInfo.TextAreaRelativePoint, HeroInfo.TextAreaOffsetX, HeroInfo.TextAreaOffsetY)
    else
        BlzFrameSetPoint(HeroInfo.TextArea, HeroInfo.TextAreaPoint, BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), HeroInfo.TextAreaRelativePoint, HeroInfo.TextAreaOffsetX, HeroInfo.TextAreaOffsetY)
    end
    local this, col
    local col = 0
    for index = 1, HeroInfo.MaxButtonCount do
        HeroInfo.Buttons[index] = {}
        this = HeroInfo.Buttons[index]
        this.Button = BlzCreateFrame("HeroSelectorButton", HeroInfo.TextArea, 0, 0)
        this.Icon = BlzGetFrameByName("HeroSelectorButtonIcon", 0)
        this.IconPushed = BlzGetFrameByName("HeroSelectorButtonIconPushed", 0)
        this.IconOff = BlzGetFrameByName("HeroSelectorButtonIconDisabled", 0)
        this.TooltipBox = BlzCreateFrame("HeroSelectorTextBox", this.Button, 0, 0)
        this.Tooltip = BlzCreateFrame("HeroSelectorText", this.TooltipBox, 0, 0)
        BlzFrameSetSize(this.Button, HeroInfo.ButtonSizeX, HeroInfo.ButtonSizeY)
        if HeroInfo.ToolTipFixedPos then
            BlzFrameSetPoint(this.Tooltip, FRAMEPOINT_BOTTOMLEFT, HeroInfo.Buttons[1].Button, FRAMEPOINT_TOPLEFT, 0, 0.007)
        else
            BlzFrameSetPoint(this.Tooltip, FRAMEPOINT_BOTTOMLEFT, this.Button, FRAMEPOINT_TOPLEFT, 0, 0.007)
        end
        BlzFrameSetPoint(this.TooltipBox, FRAMEPOINT_BOTTOMLEFT, this.Tooltip, FRAMEPOINT_BOTTOMLEFT, -0.007, -0.007)
        BlzFrameSetPoint(this.TooltipBox, FRAMEPOINT_TOPRIGHT, this.Tooltip, FRAMEPOINT_TOPRIGHT, 0.007, 0.007)
        BlzFrameSetTooltip(this.Button, this.TooltipBox)
        BlzFrameSetSize(this.Tooltip, HeroInfo.ToolTipSize, 0)
        if index > 1 then
            
            col = col + 1
            if col >= HeroInfo.ButtonPerRow then
                col = 0
                BlzFrameSetPoint(this.Button, FRAMEPOINT_TOPLEFT, HeroInfo.Buttons[index - HeroInfo.ButtonPerRow].Button, FRAMEPOINT_BOTTOMLEFT, 0.00, -0.004)
            else
                BlzFrameSetPoint(this.Button, FRAMEPOINT_TOPLEFT, HeroInfo.Buttons[index - 1].Button, FRAMEPOINT_TOPRIGHT, 0.004, 0)
            end
        else
            BlzFrameSetPoint(this.Button, FRAMEPOINT_TOPLEFT, HeroInfo.TextArea, FRAMEPOINT_BOTTOMLEFT, 0.002, 0)
        end
        
        BlzFrameSetEnable(this.Button, false)
        BlzFrameSetVisible(this.Button, false)
    end
end

function HeroInfo.UpdateSkillPreivew(icon, name, text)

    HeroInfo.ButtonCurrentIndex = HeroInfo.ButtonCurrentIndex + 1
    local object = HeroInfo.Buttons[HeroInfo.ButtonCurrentIndex]
    if not object then return end

    BlzFrameSetVisible(object.Button, true)

    BlzFrameSetTexture(object.Icon, icon, 0, false)
    BlzFrameSetTexture(object.IconPushed, icon, 0, false)
    BlzFrameSetTexture(object.IconOff, HeroSelector.getDisabledIcon(icon), 0, false)
    BlzFrameSetTexture(object.IconOff, icon, 0, false)

    -- x Size and no y Size makes it multiline text when the text does not fit into 1 line

    if text and name then
        BlzFrameSetSize(object.Tooltip, HeroInfo.ToolTipSize, 0)
        BlzFrameSetText(object.Tooltip, name.."\n"..text)
    else
        -- only the name, set frameSize to 0/0 to match the displayed text
        BlzFrameSetSize(object.Tooltip, 0, 0)
        BlzFrameSetText(object.Tooltip, name)
    end
end

function HeroSelector.ValidTooltip(text)
    if text == "Tool tip missing!" or text == "" or text == " " then
        return false
    end
    return true
end

function HeroSelector.abiFilter(abi)
    -- no skills markes as item skills
    if BlzGetAbilityBooleanField(abi, ABILITY_BF_ITEM_ABILITY) then
        return false
    end

    if not HeroSelector.ValidTooltip(BlzGetAbilityStringLevelField(abi, ABILITY_SLF_TOOLTIP_NORMAL, 0)) then
        return false
    end
    
    return true
end

function HeroSelector.buttonSelected(player, unitCode)
    HeroInfo.BackupSelected(player, unitCode)
    local dummyUnit 
    if HeroInfo.DetectUnitSkills then
        dummyUnit = CreateUnit(Player(GetPlayerNeutralPassive()), unitCode, 0, 0, 0)
    end

    -- Reset the global button Index
    HeroInfo.ButtonCurrentIndex = 0

    if GetLocalPlayer() == player then
        local hName = getHeroName(unitCode)
        BlzFrameSetText(HeroInfo.TextArea, HeroInfo.DescHeroNamePrefix .. hName .. HeroInfo.DescHeroNameSufix)
        BlzFrameAddText(HeroInfo.TextArea, BlzGetAbilityExtendedTooltip(unitCode,0))

        if not HeroInfo.HeroData[unitCode] and HeroInfo.HeroData[GetFourCC(unitCode)] then
            -- user did a none number setup
            unitCode = GetFourCC(unitCode)
        end
        
        if HeroInfo.HeroData[unitCode] then
            local startIndex = 1
            while startIndex + 3 <= string.len(HeroInfo.HeroData[unitCode])  do
                local skillCode = string.sub(HeroInfo.HeroData[unitCode], startIndex, startIndex + 3)
                
                startIndex = startIndex + 5
                skillCode = FourCC(skillCode)
                
                -- for hero skills show the learn text, "Tool tip missing!" is the default string
                if HeroSelector.ValidTooltip(BlzGetAbilityResearchExtendedTooltip(skillCode, 0)) then
                    HeroInfo.UpdateSkillPreivew(BlzGetAbilityIcon(skillCode), GetObjectName(skillCode), BlzGetAbilityResearchExtendedTooltip(skillCode, 0) )
                elseif HeroSelector.ValidTooltip(BlzGetAbilityExtendedTooltip(skillCode, 0)) then
                    -- skills without a research text show the first Level
                    HeroInfo.UpdateSkillPreivew(BlzGetAbilityIcon(skillCode), GetObjectName(skillCode), BlzGetAbilityExtendedTooltip(skillCode, 0) )
                else
                    HeroInfo.UpdateSkillPreivew(BlzGetAbilityIcon(skillCode), GetObjectName(skillCode))                    
                end
            end
        end

        if HeroInfo.DetectUnitSkills then
            local abi, abiIndex
            abiIndex = 0
            while (true) do
                abi = BlzGetUnitAbilityByIndex(dummyUnit, abiIndex)
                if abi then
                    if HeroSelector.abiFilter(abi) then
                        if HeroSelector.ValidTooltip(BlzGetAbilityStringLevelField(abi, ABILITY_SLF_TOOLTIP_LEARN_EXTENDED, 0)) then
                            HeroInfo.UpdateSkillPreivew(BlzGetAbilityStringLevelField(abi, ABILITY_SLF_ICON_NORMAL, 0), BlzGetAbilityStringLevelField(abi, ABILITY_SLF_TOOLTIP_NORMAL, 0), BlzGetAbilityStringLevelField(abi, ABILITY_SLF_TOOLTIP_LEARN_EXTENDED, 0))
                        else
                            HeroInfo.UpdateSkillPreivew(BlzGetAbilityStringLevelField(abi, ABILITY_SLF_ICON_NORMAL, 0), BlzGetAbilityStringLevelField(abi, ABILITY_SLF_TOOLTIP_NORMAL, 0), BlzGetAbilityStringLevelField(abi, ABILITY_SLF_TOOLTIP_NORMAL_EXTENDED, 0))
                        end
                    end
                    abiIndex = abiIndex + 1
                else
                    break
                end
            end
        end

        for index = HeroInfo.ButtonCurrentIndex + 1, HeroInfo.MaxButtonCount do
            BlzFrameSetVisible(HeroInfo.Buttons[index].Button, false)
        end
    end

    if HeroInfo.DetectUnitSkills then
        RemoveUnit(dummyUnit)
        dummyUnit = nil
    end
end