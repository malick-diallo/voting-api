import {Entity, hasMany, model, property} from '@loopback/repository';
import {Vote} from './vote.model';

@model()
export class Candidat extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  nom: string;

  @property({
    type: 'string',
    required: true,
  })
  prenom: string;

  @property({
    type: 'string',
    required: true,
  })
  role: string;

  @property({
    type: 'number',
    required: true,
  })
  age: number;

  @property({
    type: 'string',
  })
  photo?: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'string',
  })
  programme?: string;

  @hasMany(() => Vote)
  votes: Vote[];

  constructor(data?: Partial<Candidat>) {
    super(data);
  }
}

export interface CandidatRelations {
  // describe navigational properties here
}

export type CandidatWithRelations = Candidat & CandidatRelations;
