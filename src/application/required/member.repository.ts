import { Member } from '@/domain/member';
import { Repository } from 'typeorm';

/**
 * 회원 정보를 저장하거나 조회한다.
 */
export interface MemberRepository extends Repository<Member> {}

// export const MEMBER_REPOSITORY = Symbol('MemberRepository');
