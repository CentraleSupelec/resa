// @flow

const mongoose = require("mongoose");

/* ::
  import type { Member, User, Membership, SimplifiedMembership, Group } from '../types.flow';
*/

const { adminHasPermissions, permissions } = require("./admin");
const roomConfig = require("../webservice/translatorConfig").room;

const schema = mongoose.Schema({
  id: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  memberOf: {
    type: [
      mongoose.Schema({
        groupId: { type: Number, required: true },
        addedBy: { type: String, required: true },
      }),
    ],
    required: true,
  },
  managerOf: {
    type: [
      mongoose.Schema({
        groupId: { type: Number, required: true },
        isMainManager: { type: Boolean },
        addedBy: { type: String, required: true },
      }),
    ],
    required: true,
  },
});

const MemberModel = mongoose.model("Member", schema);

/* ::
  type Groups = Array<{|
    groupId: number,
    label: string,
  |}>
*/
// $FlowFixMe
const groups /* : Groups */ = Object.values(roomConfig.belongsTo.ValPro);

/* ::
  type GetMemberFromEmail = (email: string) => Promise<Member | null>
*/
const getMemberFromEmail /* : GetMemberFromEmail */ = (email) =>
  MemberModel.findOne({ email });

/* ::
  type GenerateMember = (rawMember: User) => Promise<Member>
*/
const generateMember /* : GenerateMember */ = async (rawMember) => {
  const member /* : Member */ = {
    id: rawMember.id,
    firstName: rawMember.firstName,
    lastName: rawMember.lastName,
    email: rawMember.email,
    memberOf: [],
    managerOf: [],
  };
  const memberInstance = new MemberModel(member);
  return memberInstance.save();
};

/* ::
  type VerifyUserOfGroup = (
    email: string,
    groupdId: number,
    type?: 'memberOf' | 'managerOf'
  ) => Promise<boolean>
*/
const verifyUserOfGroup /* : VerifyUserOfGroup */ = async (
  email,
  groupId,
  type = "memberOf",
) => {
  try {
    if (!["memberOf", "managerOf"].includes(type)) {
      throw new Error("Wrong type");
    }
    const member = await getMemberFromEmail(email);
    if (member === null) {
      throw new Error("Member doesn't exist");
    }
    if (!member[type].map((edge) => edge.groupId).includes(groupId)) {
      throw new Error("Doesn't contain groupId");
    }
    return true;
  } catch (e) {
    return false;
  }
};

/* ::
  type VerifyRightModifyManagers = (email: string, groupId: number) => Promise<boolean>;
*/
const verifyRightModifyManagers /* : VerifyRightModifyManagers */ = async (
  email,
  groupId,
) => {
  try {
    if (
      !(
        (await verifyUserOfGroup(email, groupId, "managerOf")) ||
        (await adminHasPermissions(email, [permissions.ADD_MANAGER]))
      )
    ) {
      throw new Error("No rights");
    }
    return true;
  } catch (e) {
    return false;
  }
};

/* ::
  type MembersOfGroup = (groupId: number) => Promise<Member[]>
*/
const membersOfGroup /* : MembersOfGroup */ = (groupId) =>
  MemberModel.find({ memberOf: { $elemMatch: { groupId } } });

const managersOfGroup /* : (groupId: number, strict?: boolean) => Promise<Member[]> */ = (
  groupId,
  strict = false,
) => {
  if (strict) {
    return MemberModel.find({
      managerOf: { $elemMatch: { groupId, isMainManager: false } },
    });
  }

  return MemberModel.find({ managerOf: { $elemMatch: { groupId } } });
};

const mainManagersOfGroup /* : MembersOfGroup */ = (groupId) =>
  MemberModel.find({
    managerOf: { $elemMatch: { groupId, isMainManager: true } },
  });

/* ::
  type PromoteManager = (
    previousManagerEmail: string,
    newManagerEmail: string,
    groupId: number,
  ) => Promise<Member>
*/
const promoteManager /* : PromoteManager */ = async (
  previousManagerEmail,
  newManagerEmail,
  groupId,
) => {
  if (!(await verifyRightModifyManagers(previousManagerEmail, groupId))) {
    throw new Error(
      `There is no manager or admin of email "${previousManagerEmail}" for the group ${groupId}`,
    );
  }
  const member = await getMemberFromEmail(newManagerEmail);
  if (member === null) {
    throw new Error(`There is no member of email: "${newManagerEmail}"`);
  }
  if (!member.memberOf.map((edge) => edge.groupId).includes(groupId)) {
    member.memberOf.push({
      groupId,
      addedBy: previousManagerEmail,
    });
  }
  if (!member.managerOf.map((edge) => edge.groupId).includes(groupId)) {
    member.managerOf.push({
      groupId,
      addedBy: previousManagerEmail,
      isMainManager: false,
    });
  }
  // $FlowFixMe
  return member.save();
};

/* ::
  type PromoteMainManager = (
    previousManagerEmail: string,
    newManagerEmail: string,
    groupId: number,
  ) => Promise<Member>
*/
const promoteMainManager /* : PromoteMainManager */ = async (
  previousManagerEmail,
  newManagerEmail,
  groupId,
) => {
  const manager = await promoteManager(
    previousManagerEmail,
    newManagerEmail,
    groupId,
  );
  const mainManagers = await mainManagersOfGroup(groupId);
  await Promise.all(
    mainManagers.map((mainManager) => {
      mainManager.managerOf
        .filter(
          ({ isMainManager, groupId: gId }) => isMainManager && gId === groupId,
        )
        .map((m) => {
          // eslint-disable-next-line
          m.isMainManager = false;
          return m;
        });
      // $FlowFixMe
      return mainManager.save();
    }),
  );
  const mainManagerMembership = manager.managerOf.find(
    ({ groupId: gId }) => gId === groupId,
  );
  if (mainManagerMembership) {
    mainManagerMembership.isMainManager = true;
  }
  // $FlowFixMe
  return manager.save();
};

/* ::
  type RevokeMainManager = (
    masterManagerEmail: string,
    toRevokeManagerEmail: string,
    groupId: number,
  ) => Promise<Member>
*/
const revokeMainManager /* : RevokeMainManager */ = async (
  masterManagerEmail,
  toRevokeManagerEmail,
  groupId,
) => {
  if (!(await verifyRightModifyManagers(masterManagerEmail, groupId))) {
    throw new Error(
      `There is no manager or admin of email "${masterManagerEmail}" for the group ${groupId}`,
    );
  }
  const member = await getMemberFromEmail(toRevokeManagerEmail);
  if (member === null) {
    throw new Error(`There is no member of email: "${toRevokeManagerEmail}"`);
  }
  const mainManagerMembership = member.managerOf.find(
    (membership) => membership.groupId === groupId && membership.isMainManager,
  );
  if (mainManagerMembership) {
    mainManagerMembership.isMainManager = false;
  }
  // $FlowFixMe
  return member.save();
};

/* ::
  type RevokeManager = (
    masterManagerEmail: string,
    toRevokeManagerEmail: string,
    groupId: number,
  ) => Promise<Member>
*/
const revokeManager /* : RevokeManager */ = async (
  masterManagerEmail,
  toRevokeManagerEmail,
  groupId,
) => {
  if (!(await verifyRightModifyManagers(masterManagerEmail, groupId))) {
    throw new Error(
      `There is no manager or admin of email "${masterManagerEmail}" for the group ${groupId}`,
    );
  }
  if (masterManagerEmail === toRevokeManagerEmail) {
    throw new Error(
      `${masterManagerEmail} cannot remove itself from the managers of the group ${groupId}`,
    );
  }
  const member = await getMemberFromEmail(toRevokeManagerEmail);
  if (member === null) {
    throw new Error(`There is no member of email: "${toRevokeManagerEmail}"`);
  }
  member.managerOf = member.managerOf.filter(
    (membership) => membership.groupId !== groupId,
  );
  // $FlowFixMe
  return member.save();
};

/* ::
  type AddNewMember = (
    managerEmail: string,
    rawMember: User,
    groupId: number,
  ) => Promise<Member>
*/
const addNewMember /* : AddNewMember */ = async (
  managerEmail,
  rawMember,
  groupId,
) => {
  if (!(await verifyRightModifyManagers(managerEmail, groupId))) {
    throw new Error(
      `There is no manager or admin of email "${managerEmail}" for the group ${groupId}`,
    );
  }
  let member = await getMemberFromEmail(rawMember.email);
  if (member === null) {
    member = await generateMember(rawMember);
  }
  if (!member.memberOf.map((edge) => edge.groupId).includes(groupId)) {
    member.memberOf.push({
      groupId,
      addedBy: managerEmail,
    });
  }
  // $FlowFixMe
  return member.save();
};

/* ::
  type RemoveMember = (
    managerEmail: string,
    memberEmail: string,
    groupId: number,
  ) => Promise<Member>
*/
const removeMember /* : RemoveMember */ = async (
  managerEmail,
  memberEmail,
  groupId,
) => {
  if (!(await verifyRightModifyManagers(managerEmail, groupId))) {
    throw new Error(
      `There is no manager or admin of email "${managerEmail}" for the group ${groupId}`,
    );
  }
  if (managerEmail === memberEmail) {
    throw new Error(
      `${managerEmail} cannot remove itself from the group ${groupId}`,
    );
  }
  const member = await getMemberFromEmail(memberEmail);
  if (member === null) {
    throw new Error(`There is no member of email: "${memberEmail}"`);
  }
  member.managerOf = member.managerOf.filter(
    (membership) => membership.groupId !== groupId,
  );
  member.memberOf = member.memberOf.filter(
    (membership) => membership.groupId !== groupId,
  );
  // $FlowFixMe
  return member.save();
};

/* ::
  type ParseMember = (
    groupId: number,
    members: Member,
    type?: 'memberOf' | 'managerOf' | 'mainManager',
  ) => SimplifiedMembership;
*/
const parseMember = (groupId, member, type = "memberOf") => {
  const membership /* : Membership | void */ = member[type].find(
    (edge) => edge.groupId === groupId,
  );
  if (!membership) {
    return null;
  }
  return {
    id: member.id,
    firstName: member.firstName,
    lastName: member.lastName,
    email: member.email,
    addedBy: membership.addedBy,
  };
};

/* ::
  type ParseMembers = (
    groupId: number,
    members: Member[],
    type?: 'memberOf' | 'managerOf' | 'mainManager',
  ) => SimplifiedMembership[];
*/
const parseMembers /* : ParseMembers */ = (
  groupId,
  members,
  type = "memberOf",
) =>
  members.map((member) => parseMember(groupId, member, type)).filter(Boolean);

/* ::
  type GetGroup = (groupId: number) => Promise<SimplifiedMembership>
*/
const getGroup /* : GetGroup */ = async (groupId) => {
  const [members, managers, mainManagers] = await Promise.all([
    await membersOfGroup(groupId),
    await managersOfGroup(groupId, true),
    await mainManagersOfGroup(groupId),
  ]);
  let mainManager = null;
  if (mainManagers) {
    if (mainManagers.length >= 1) {
      mainManager = parseMember(groupId, mainManagers[0], "managerOf");
    }
  }

  const group = {
    ...roomConfig.belongsTo.ValPro[groupId.toString()],
    members: parseMembers(groupId, members, "memberOf"),
    mainManager,
    managers: parseMembers(groupId, managers, "managerOf"),
  };

  return group;
};

/* ::
  type GetGroupsOfManager = (managerEmail: string) => Promise<SimplifiedMembership[]>
*/
const getGroupsOfManager /* : GetGroupsOfManager */ = async (managerEmail) => {
  if (await adminHasPermissions(managerEmail, [permissions.ADD_MANAGER])) {
    return Promise.all(groups.map((group) => getGroup(group.groupId)));
  }
  const manager = await getMemberFromEmail(managerEmail);
  if (manager === null) {
    return [];
  }
  return Promise.all(
    manager.managerOf.map((membership) => getGroup(membership.groupId)),
  );
};

module.exports = {
  groups,
  getMemberFromEmail,
  generateMember,
  verifyUserOfGroup,
  verifyRightModifyManagers,
  membersOfGroup,
  managersOfGroup,
  mainManagersOfGroup,
  promoteManager,
  promoteMainManager,
  revokeMainManager,
  revokeManager,
  addNewMember,
  removeMember,
  getGroup,
  getGroupsOfManager,
};
