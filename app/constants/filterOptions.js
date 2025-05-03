const filterOptions = {
  ratings: [
    { id: 'safe', label: 'Safe', color: 'bg-emerald-500' },
    { id: 'suggestive', label: 'Suggestive', color: 'bg-amber-500' },
    { id: 'erotica', label: 'Erotica', color: 'bg-rose-500' },
    { id: 'pornographic', label: 'Adult', color: 'bg-red-700' }
  ],
  statuses: [
    { id: 'ongoing', label: 'Ongoing', color: 'bg-emerald-400' },
    { id: 'completed', label: 'Completed', color: 'bg-blue-400' },
    { id: 'hiatus', label: 'Hiatus', color: 'bg-amber-400' },
    { id: 'cancelled', label: 'Cancelled', color: 'bg-red-400' }
  ],
  languages: [
    { code: 'en', label: 'English' },
    { code: 'ja', label: 'Japanese' },
    { code: 'ko', label: 'Korean' },
    { code: 'zh', label: 'Chinese (Simplified)' },
    { code: 'zh-hk', label: 'Chinese (Traditional)' },
    { code: 'fr', label: 'French' },
    { code: 'de', label: 'German' },
    { code: 'es', label: 'Spanish' },
    { code: 'es-la', label: 'Spanish (Latin America)' },
    { code: 'it', label: 'Italian' },
    { code: 'pt', label: 'Portuguese' },
    { code: 'pt-br', label: 'Portuguese (Brazil)' },
    { code: 'ru', label: 'Russian' },
    { code: 'th', label: 'Thai' },
    { code: 'vi', label: 'Vietnamese' },
    { code: 'id', label: 'Indonesian' },
    { code: 'ar', label: 'Arabic' }
  ],
  demographics: [
    { id: 'shounen', label: 'Shounen' },
    { id: 'shoujo', label: 'Shoujo' },
    { id: 'seinen', label: 'Seinen' },
    { id: 'josei', label: 'Josei' }
  ],
  publicationTypes: [
    { id: 'manga', label: 'Manga', color: 'bg-blue-500' },
    { id: 'manhwa', label: 'Manhwa', color: 'bg-purple-500' },
    { id: 'manhua', label: 'Manhua', color: 'bg-orange-500' },
    { id: 'doujinshi', label: 'Doujinshi', color: 'bg-pink-500' },
    { id: 'oneshot', label: 'One-shot', color: 'bg-teal-500' },
    { id: 'oel', label: 'OEL', color: 'bg-gray-500' }
  ],
  genres: [
    { id: '391b0423-d847-456f-aff0-8b0cfc03066b', label: 'Action' },
    { id: '87cc87cd-a395-47af-b27a-93258283bbc6', label: 'Adventure' },
    { id: '4d32b7dd-4f29-4b33-b034-9c3476a45661', label: 'Comedy' },
    { id: 'b9af3a63-f058-46de-a9a0-e0c13906197a', label: 'Drama' },
    { id: 'cdc58593-87dd-415e-bbc0-2ec27bf404cc', label: 'Fantasy' },
    { id: 'f8f62932-27da-4fe4-8ee1-6779a8c5edba', label: 'Horror' },
    { id: '3e2b8dae-350e-4ab8-a8ce-016e844b9f0d', label: 'Mystery' },
    { id: '423e2eae-a7a2-4a8b-ac03-a8351462d71d', label: 'Romance' },
    { id: '256c8bd9-4904-4360-bf4f-508a76d67183', label: 'Sci-Fi' },
    { id: 'e5301a23-ebd9-49dd-a0cb-2add944c7fe9', label: 'Slice of Life' },
    { id: 'ee968100-4191-4968-93d3-f82d72be7e46', label: 'Thriller' },
    { id: '33771934-028e-4cb3-8744-691e866a923e', label: 'Sports' },
    { id: 'b29d6a3d-1569-4e7a-8caf-7557bc92cd5d', label: 'Supernatural' },
    { id: '3b60b75c-a2d7-4860-ab56-05f391bb889c', label: 'Psychological' },
    { id: '7064a261-a137-4d3a-8848-2d385de3a99c', label: 'Mecha' },
    { id: '50880a9d-5440-4732-9aea-8cfbf55854d6', label: 'Crime' },
    { id: '5ca48985-9a9d-4bd8-be29-80dc0303c5d7', label: 'Historical' }
  ],
  themes: [
    { id: 'a3c67850-4684-4761-9c58-6e6a7e781e71', label: 'Isekai' },
    { id: '2bd2e8d0-ce18-4c43-91a1-8b9ae6823f25', label: 'Harem' },
    { id: 'fad12b5e-68ba-4620-a6d2-0f1546ed514c', label: 'School Life' },
    { id: 'aafb99c1-7f60-43fa-b75f-fc9502ce29c7', label: 'Ecchi' },
    { id: 'df33b754-73a3-4c54-80e6-1a74a8058539', label: 'Martial Arts' },
    { id: '39730448-9c03-4257-b304-0e45e8b71657', label: 'Yuri' },
    { id: 'da2d50ca-3018-4cc0-ac7a-6b7d9a9a6f22', label: 'Yaoi' },
    { id: 'eabc5b4c-6aff-42f3-b657-3e90cbd00b75', label: 'Shounen Ai' },
    { id: '3bb26d85-09d5-4d2e-880c-c34b974339e9', label: 'Shoujo Ai' },
    { id: '81183756-1453-4c81-aa9e-f6e1b63be016', label: 'Music' },
    { id: 'f5ba408b-0e7a-484d-8d49-4e9125ab9558', label: 'Reverse Harem' },
    { id: 'acc803bf-2038-44f7-b0eb-d3f576b9b7d1', label: 'Gender Bender' },
    { id: '2d1f5e56-a1e5-4d0d-a961-2193588b08ec', label: 'Gore' },
    { id: 'e64f6742-c834-471d-8d72-dd51fc02b835', label: 'Cooking' },
    { id: '0bc90acb-ccc1-44ca-a34a-b5936f7e96a4', label: 'Video Games' },
    { id: '92d6d951-ca5e-429c-ac78-451071cbf064', label: 'Office Workers' },
    { id: '0234a31e-a729-4e28-9d6a-3f87c4966b9e', label: 'Time Travel' }
  ],
  tagModes: [
    { id: 'AND', label: 'All Tags (AND)', color: 'bg-gray-500' },
    { id: 'OR', label: 'Any Tags (OR)', color: 'bg-gray-400' }
  ]
};

export default filterOptions;