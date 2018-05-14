
import {di} from 'jsmodules';
import { MemKeyValueStorage } from '../src/storage/memory/KeyValueStorage';
import '../src/containers/AppContainer';

const {container} = di;

container.bind("kvStorage").to(MemKeyValueStorage).params("kvStorage");
container.bind("productStorage").to(MemKeyValueStorage).params("productStorage");