"use client";

import { Select, Typography, Flex } from 'antd';
import { useState, useEffect } from 'react';

export default () => {
  const [mounted     , setMounted]   = useState(false);

  const [group   , setGroup   ] = useState("");
  const [groups  , setGroups  ] = useState([]);
  const [section , setSection ] = useState("");
  const [sections, setSections] = useState([]);

  const handleGroupChange = (value) => {
    setGroup(value);

    fetch(`/example-backend/api/v1/eiken/sections?level=2-1&group=${value}`)
      .then(response => console.log(response.status) || response)
      .then(response => response.text())
      .then(body => {
        let jsonData = JSON.parse(body);
        setSections(jsonData); });
  };

  const onSectionChange = (value) => { setSection(value); };

  useEffect(() => { 
    setMounted(true);

    fetch("/example-backend/api/v1/eiken/groups?level=2-1")
      .then(response => console.log(response.status) || response)
      .then(response => response.text())
      .then(body => {
        console.log(body);
        let jsonData = JSON.parse(body);
        setGroups(jsonData); });
   }, [])

  return mounted && (
    <Flex justify='space-evenly' align='center' gap={ 80 }>
      <Flex vertical='vertical' justify='space-evenly'>
        <Typography.Title level={5}>Group</Typography.Title>
        <Select
          defaultValue={groups[0]}
          style={{ width: 120 }}
          onChange={handleGroupChange}
          options={groups.map((group) => ({ label: `Group ${group}`, value: group }))}
        />
      </Flex>
      <Flex vertical='vertical' justify='space-evenly'>
        <Typography.Title level={5}>Section</Typography.Title>
        <Select
          style={{ width: 120 }}
          value={section}
          onChange={onSectionChange}
          options={sections.map((section) => ({ label: `Section ${section}`, value: section }))}
        />
      </Flex>
    </Flex>
  );
};
