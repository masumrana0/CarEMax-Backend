import { IProfile } from './profile.interface';
import { Profile } from './profile.model';

// Get Profile
const getProfile = async (id: string): Promise<IProfile | null> => {
  const result = await Profile.findOne({ user: id }).populate('user');
  return result;
};

// update profile
const updateProfile = async (
  id: string,
  payload: Partial<IProfile>,
): Promise<IProfile | null> => {
  const isExistedProfile = await Profile.findOne({ user: id });

  if (isExistedProfile) {
    const result = await Profile.findByIdAndUpdate(
      {
        _id: isExistedProfile?._id,
      },
      { payload },
    );
    return result;
  } else {
    const result = await Profile.create({ user: id, ...payload });
    return result;
  }
};

export const ProfileService = {
  getProfile,
  updateProfile,
};
