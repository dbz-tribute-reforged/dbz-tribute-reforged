import { Constants, Id } from "./Constants";
import { UnitHelper } from "./UnitHelper";

export module MinimapHelper {
  export const minimapTeam1BG = "MM_bg_red.mdl";
  export const minimapTeam2BG = "MM_bg_blue.mdl";
  export const genericHeroIcon = "MM_hero.mdl";
  export const minimapIDIconMap: Map<number, string> = new Map(
    [
      [Id.goku, "MM_goku.mdl"],
      [Id.vegeta, "MM_vegeta.mdl"],
      [Id.vegetaMajin, "MM_vegeta_majin.mdl"],
      [Id.gohan, "MM_gohan.mdl"],
      [Id.goten, "MM_goten.mdl"],
      [Id.kidTrunks, "MM_kid_trunks.mdl"],
      [Id.gotenks, "MM_gotenks.mdl"],
      [Id.ft, "MM_future_trunks.mdl"],
      [Id.piccolo, "MM_piccolo.mdl"],
      [Id.android13, "MM_android13.mdl"],
      [Id.android14, "MM_android14.mdl"],
      [Id.android15, "MM_android15.mdl"],
      [Id.superAndroid13, "MM_android13_super.mdl"],
      [Id.babidi, "MM_babidi.mdl"],
      [Id.babidiDabura, "MM_dabura.mdl"],
      [Id.babidiYakonUnit, "MM_yakon.mdl"],
      [Id.babidiPuiPuiUnit, "MM_pui_pui.mdl"],
      [Id.fatBuu, "MM_fat_buu.mdl"],
      [Id.superBuu, "MM_super_buu.mdl"],
      [Id.kidBuu, "MM_kid_buu.mdl"],
      [Id.broly, "MM_broly.mdl"],
      [Id.cellUnformed, "MM_cell_bug.mdl"],
      [Id.cellFirst, "MM_cell1.mdl"],
      [Id.cellSemi, "MM_cell2.mdl"],
      [Id.cellPerfect, "MM_cell3.mdl"],
      [Id.cellJrUnit, "MM_cell_jr.mdl"],
      [Id.cellMax, "MM_cell_max.mdl"],
      [Id.fourthCooler, "MM_cooler4.mdl"],
      [Id.fifthCooler, "MM_cooler5.mdl"],
      [Id.metalCooler, "MM_cooler_metal.mdl"],
      [Id.metalCoolerClone, "MM_cooler_metal.mdl"],
      [Id.getiStarHero, "MM_geti_star.mdl"],
      [Id.bardock, "MM_bardock.mdl"],
      [Id.pan, "MM_pan.mdl"],
      [Id.panGiruUnit, "MM_giru.mdl"],
      [Id.farmerWithShotgun, "MM_farmer_with_shotgun.mdl"],
      [Id.raditz, "MM_raditz.mdl"],
      [Id.nappa, "MM_nappa.mdl"],
      [Id.moro, "MM_moro.mdl"],
      [Id.android17dbs, "MM_android17_dbs.mdl"],
      [Id.janemba, "MM_janemba_super.mdl"],
      [Id.videl, "MM_videl.mdl"],
      [Id.upa, "MM_upa.mdl"],
      [Id.kkr, "MM_kkr.mdl"],
      [Id.tapion, "MM_tapion.mdl"],
      [Id.eisShenron, "MM_eis_shenron.mdl"],
      [Id.toppo, "MM_toppo.mdl"],
      [Id.ginyu, "MM_ginyu.mdl"],
      [Id.frieza, "MM_frieza.mdl"],
      [Id.omegaShenron, "MM_omega_shenron.mdl"],
      [Id.dyspo, "MM_dyspo.mdl"],
      [Id.krillin, "MM_krillin.mdl"],
      [Id.yamchaR, "MM_yamchaR.mdl"],
      [Id.guldo, "MM_guldo.mdl"],
      [Id.jiren, "MM_jiren.mdl"],
      [Id.roshi, "MM_roshi.mdl"],
      [Id.zamasu, "MM_zamasu.mdl"],
      [Id.allMight, "MM_all_might.mdl"],
      [Id.sephiroth, "MM_sephiroth.mdl"],
      [Id.hit, "MM_hit.mdl"],
      [Id.mario, "MM_mario.mdl"],
      [Id.tien, "MM_tien.mdl"],
      [Id.ichigo, "MM_ichigo.mdl"],
      [Id.dartFeld, "MM_dart_feld.mdl"],
      [Id.rustTyranno, "MM_rust_tyranno.mdl"],
      [Id.crono, "MM_crono.mdl"],
      [Id.frog, "MM_frog.mdl"],
      [Id.robo, "MM_robo.mdl"],
      [Id.magus, "MM_magus.mdl"],
      [Id.lucca, "MM_lucca.mdl"],
      [Id.ayla, "MM_ayla.mdl"],
      [Id.marle, "MM_marle.mdl"],
      [Id.lucario, "MM_lucario.mdl"],
      [Id.saitama, "MM_saitama.mdl"],
      [Id.donkeyKong, "MM_donkey_kong.mdl"],
      [Id.hirudegarn, "MM_hirudegarn.mdl"],
      [Id.super17, "MM_super17.mdl"],
      [Id.schala, "MM_schala.mdl"],
      [Id.shotoTodoroki, "MM_shoto_todoroki.mdl"],
      [Id.skurvy, "MM_skurvy.mdl"],
      [Id.sonic, "MM_sonic.mdl"],
      [Id.appule, "MM_appule.mdl"],
      [Id.guts, "MM_guts.mdl"],
      [Id.jaco, "MM_jaco.mdl"],
      [Id.waluigi, "MM_waluigi.mdl"],
      [Id.gokuBlack, "MM_goku_black.mdl"],
      [Id.leonSKennedy, "MM_leon_s_kennedy.mdl"],
      [Id.megumin, "MM_megumin.mdl"],
      [Id.pecorine, "MM_pecorine.mdl"],
      [Id.dende, "MM_dende.mdl"],
      [Id.linkTwilight, "MM_link_twilight.mdl"],
      [Id.ainzOoalGown, "MM_ainz_ooal_gown.mdl"],
      [Id.albedo, "MM_albedo.mdl"],
      [Id.shalltearBloodfallen, "MM_shalltear.mdl"],
      [Id.demiurge, "MM_demiurge.mdl"],
      [Id.minato, "MM_minato.mdl"],
      [Id.mightGuy, "MM_might_guy.mdl"],
      [Id.genos, "MM_genos.mdl"],
      [Id.tatsumaki, "MM_tatsumaki.mdl"],
      [Id.whis, "MM_whis.mdl"],
      [Id.beerus, "MM_beerus.mdl"],
      [Id.granolah, "MM_granolah.mdl"],
    ]
  );

  export function isUnitMinimapVisible(unit: unit): boolean {
    return (
      !IsUnitHidden(unit)
      && !IsUnitFogged(unit, GetLocalPlayer()) 
      && IsUnitVisible(unit, GetLocalPlayer())
      && UnitHelper.isUnitAlive(unit)
    );
  }

  export function getMinimapIcon(unit: unit): string {
    const unitId = GetUnitTypeId(unit);
    const value = minimapIDIconMap.get(unitId);
    return value ? value : genericHeroIcon;
  }

  export function getMinimapIconBG(unit: unit): string {
    const player = GetOwningPlayer(unit);
    // return Math.random() < 0.5 ? minimapTeam1BG : minimapTeam2BG;
    for (const x of Constants.defaultTeam1) {
      if (x == player) return minimapTeam1BG;
    }
    return minimapTeam2BG;
  }
}