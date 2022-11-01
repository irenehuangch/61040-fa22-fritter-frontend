import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Studio, PopulatedStudio} from './model';
import type {Freet, PopulatedFreet} from '../freet/model';

// Update this if you add a property to the Freet type!
type StudioResponse = {
  _id: string;
  freet: Freet;
  font: string;
  color: string;
  dateModified: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Studio>} studio - A studio component
 * @returns {StudioResponse} - The freet object formatted for the frontend
 */
const constructStudioResponse = async (studio: HydratedDocument<Studio>): Promise<StudioResponse> => {
  const studioCopy: PopulatedStudio = {
    ...studio.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  return {
    _id: studioCopy._id.toString(),
    freet: studioCopy.freetId,
    font: studioCopy.font,
    color: studioCopy.color,
    dateModified: formatDate(studioCopy.dateModified)
  };
};

export {
  constructStudioResponse
};
