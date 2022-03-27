-- -- Credits Luashine
-- -- FourCC breaks after Save & Load and only worked for 4 digit rawcodes
-- function FourCC(str)
--     local n = 0
--     local len = #str
--     for i = len, 1, -1 do
--         n = n + (str:byte(i,i) << 8*(len-i)) -- shift by 0,8,16,24
--     end
--     return n
-- end

-- do
--     local real = InitBlizzard
--     function InitBlizzard()
--         real()

--         -- enable the next line as soon blizzard fixed the bug in current version
--         --if GetLocalizedString("REFORGED") ~= "REFORGED" then return end

--         local tim  = CreateTimer()
--         local trig   = CreateTrigger()
--         TriggerRegisterGameEvent(trig, EVENT_GAME_SAVE)
--         TriggerAddAction(trig, function()
--             local backup =  string.pack
--             local backup2 =  string.unpack
--             string.pack = nil
--             string.unpack = nil

--             TimerStart(tim, 0, false, function()
--                 string.pack = backup
--                 string.unpack = backup2

--             end)
--         end)
       
--         local trig2   = CreateTrigger()
--         TriggerRegisterGameEvent(trig2, EVENT_GAME_LOADED)
--         TriggerAddAction(trig2, function()
--             -- prevent restoring the backups when the game is loaded
--             PauseTimer(tim)
--         end)

--     end
-- end
