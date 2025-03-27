import UnknownTypeError from '@nkzw/core/UnknownTypeError.js';
import { Skill, Skills } from '../info/Skill.tsx';
import { getUnitInfo, getUnitInfoOrThrow, UnitInfo } from '../info/Unit.tsx';
import { Crystal, Crystals } from '../invasions/Crystal.tsx';
import { Biome, Biomes, getBiomeName } from './Biome.tsx';

export type SkillReward = Readonly<{
  skill: Skill;
  type: 'Skill';
}>;

type UnitPortraitsReward = Readonly<{
  type: 'UnitPortraits';
  unit: UnitInfo;
}>;

type KeyartReward = Readonly<{
  type: 'Keyart';
  variant: 1 | 2;
}>;

type BiomeReward = Readonly<{
  biome: Biome;
  type: 'Biome';
}>;

type SkillSlotReward = Readonly<{
  slot: number;
  type: 'SkillSlot';
}>;

export type CrystalReward = Readonly<{
  crystal: Crystal;
  type: 'Crystal';
}>;

type EncodedSkillReward =
  | readonly [type: 0, skill: Skill]
  | readonly [type: 1, unit: number]
  | readonly [type: 2, variant: 1 | 2]
  | readonly [type: 3, biome: Biome]
  | readonly [type: 4, slot: number]
  | readonly [type: 5, crystal: Crystal];

export type Reward =
  | BiomeReward
  | CrystalReward
  | KeyartReward
  | SkillReward
  | SkillSlotReward
  | UnitPortraitsReward;

export type EncodedReward = EncodedSkillReward;
export type PlainReward = EncodedReward;

export function encodeReward(reward: Reward): EncodedReward {
  const rewardType = reward.type;
  switch (rewardType) {
    case 'Skill':
      return [0, reward.skill];
    case 'UnitPortraits':
      return [1, reward.unit.id];
    case 'Keyart':
      return [2, reward.variant];
    case 'Biome':
      return [3, reward.biome];
    case 'SkillSlot':
      return [4, reward.slot];
    case 'Crystal':
      return [5, reward.crystal];
    default:
      rewardType satisfies never;
      throw new UnknownTypeError('encodeReward', rewardType);
  }
}

export function decodeReward([rewardType, ...rest]: EncodedReward): Reward {
  switch (rewardType) {
    case 0:
      return { skill: rest[0], type: 'Skill' };
    case 1:
      return { type: 'UnitPortraits', unit: getUnitInfoOrThrow(rest[0]) };
    case 2:
      return { type: 'Keyart', variant: rest[0] === 1 ? 1 : 2 };
    case 3:
      return { biome: rest[0], type: 'Biome' };
    case 4:
      return { slot: rest[0], type: 'SkillSlot' };
    case 5:
      return { crystal: rest[0], type: 'Crystal' };
    default:
      rewardType satisfies never;
      throw new UnknownTypeError('decodeReward', rewardType);
  }
}

export function maybeEncodeReward(
  reward: Reward | null | undefined,
): EncodedReward | null {
  return reward ? encodeReward(reward) : null;
}

export function maybeDecodeReward(
  reward: EncodedReward | null | undefined,
): Reward | null {
  return reward ? decodeReward(reward) : null;
}

export function formatReward(reward: Reward): string {
  const rewardType = reward.type;
  switch (rewardType) {
    case 'Skill':
      return `Reward { skill: ${reward.skill} }`;
    case 'UnitPortraits':
      return `Reward { unit: ${reward.unit.name} }`;
    case 'Keyart':
      return `Reward { variant: ${reward.variant} }`;
    case 'Biome':
      return `Reward { biome: ${getBiomeName(reward.biome)} }`;
    case 'SkillSlot':
      return `Reward { slot: ${reward.slot} }`;
    case 'Crystal':
      return `Reward { crystal: ${reward.crystal} }`;
    default:
      rewardType satisfies never;
      throw new UnknownTypeError('formatReward', rewardType);
  }
}

export function validateReward(reward: Reward): boolean {
  switch (reward.type) {
    case 'Skill':
      return Skills.has(reward.skill);
    case 'UnitPortraits':
      return !!getUnitInfo(reward.unit.id);
    case 'Keyart':
      return reward.variant === 1 || reward.variant === 2;
    case 'Biome':
      return Biomes.includes(reward.biome);
    case 'SkillSlot':
      return reward.slot >= 2 && reward.slot <= 4;
    case 'Crystal':
      return Crystals.includes(reward.crystal);
    default:
      return false;
  }
}
