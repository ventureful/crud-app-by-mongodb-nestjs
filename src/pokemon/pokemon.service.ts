import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon, PokemonDocument } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<PokemonDocument>,
  ) {}
  async create(createPokemonDto: CreatePokemonDto) {
    console.log(createPokemonDto);
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);

      return pokemon;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `Pokemon  exist in DB ${JSON.stringify(error.keyValue)}`,
        );
      }

      console.log(error);
      throw new InternalServerErrorException(`Can't create pokemon`);
    }
  }

  async findAll() {
    return this.pokemonModel.find();
  }

  async findOne(term: string) {
    let pokemon: PokemonDocument;
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: +term });
    }

    if (isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLocaleLowerCase().trim(),
      });
    }
    if (!pokemon) throw new NotFoundException('Registro no encontrado');
    return pokemon;
  }

  async update(
    term: string,
    updatePokemonDto: UpdatePokemonDto,
  ): Promise<PokemonDocument> {
    let pokemon = await this.findOne(term);
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    pokemon = Object.assign(pokemon, updatePokemonDto);
    return pokemon.save();
  }

  async remove(term: string) {
    //eliminar registro(documento) por cualquier campo("name" o "no")

    const pokemon = await this.findOne(term);
    console.log('remove', pokemon);
    return pokemon.deleteOne();

    //Otras formas de  eliminar un registro

    // 1.-Forma. Eliminar por cualquier campo("name" o "no")
    //const pokemonId = pokemon._id;
    //return pokemon.deleteOne(pokemonId);

    // 2.-Forma ,solamente vale para el campo _id de mongodb.
    //return this.pokemonModel.deleteOne({ _id: term });

    // 3.-Forma. solamente fale para el campo _id de mongodb.
    //return this.pokemonModel.findByIdAndDelete({ _id: term });
  }
}
