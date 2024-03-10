import { Contact } from "../types";

/**
 * Recursively fetch contacts and their friends by ID.
 * @param contacts - The array of all contacts.
 * @param requestedId - The ID of the contact to start fetching from, or the contact itself.
 * @param result - The array to store the fetched contacts.
 * @param processedIds - A Set to keep track of processed contact IDs and avoid circular references.
 * @returns An array of contacts and their friends.
 */
export const fetchContactsById = (
  contacts: Contact[],
  requestedId: number,
  result: Contact[] = [],
  processedIds: Set<number> = new Set(),
): Contact[] => {
  let requestedContact: Contact | undefined;

  // Check if requestedId is a number (ID) or a contact object
  if (typeof requestedId === 'number') {
    // Find the contact in the array by ID
    requestedContact = contacts.find((contact) => contact.id === requestedId);
  } else {
    // Use the provided contact object
    requestedContact = requestedId;
  }

  // Check if the contact exists and has not been processed to avoid circular references
  if (requestedContact && !processedIds.has(requestedContact.id)) {
    // Mark the contact as processed
    processedIds.add(requestedContact.id);

    // Add the contact to the result array
    result.push(requestedContact);

    // Check if the contact has friends
    if (requestedContact.friends && requestedContact.friends.length > 0) {
      // Recursively fetch contacts for each friend
      requestedContact.friends.forEach((friendId) => {
        fetchContactsById(contacts, friendId, result, processedIds);
      });
    }
  }

  return result;
};
