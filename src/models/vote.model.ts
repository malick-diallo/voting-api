import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Candidat} from './candidat.model';
import {User} from './user.model';

@model()
export class Vote extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @belongsTo(() => Candidat)
  candidatId: string;

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<Vote>) {
    super(data);
  }
}

export interface VoteRelations {
  // describe navigational properties here
}

export type VoteWithRelations = Vote & VoteRelations;
